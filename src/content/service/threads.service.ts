import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidationException } from '../../common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateThreadDto } from '../dto/createThread.dto';
import { CommentsService } from './comments.service';
import { Content, Thread } from '@prisma/client';

@Injectable()
export class ThreadsService {
  constructor(
    private prisma: PrismaService,
    private comment: CommentsService,
  ) {}

  async findAllThreads() {
    const content_threads = await this.prisma.thread.findMany({
      include: {
        content: true,
      },
    });
    if (!content_threads) {
      throw new ValidationException('No Threads Found', HttpStatus.NOT_FOUND);
    }
    return content_threads;
  }

  async findMyThreads(userId: number) {
    const content_thread = await this.prisma.content.findMany({
      where: { owner_user_id: userId },
      include: { thread: true },
    });
    if (!content_thread) {
      throw new ValidationException('No Threads Found', HttpStatus.NOT_FOUND);
    }
    return content_thread;
  }





  async searchComments(word: string) {
    word = `*${word}*`;
    try {
      const contents = await this.prisma.$queryRaw<(Thread&Content)[]>`
          WITH RECURSIVE content_score AS (
            SELECT
              id AS content_id, 
              id AS root_id,
              SUM(MATCH(Content.content_description) AGAINST(${word} IN BOOLEAN MODE)) AS score
            FROM Content
            WHERE content_parent_id IS NULL
            GROUP BY root_id
            UNION
            SELECT
              Content.id AS content_id,
              content_score.root_id AS root_id,
              MATCH(Content.content_description) AGAINST(${word} IN BOOLEAN MODE) AS score
            FROM content_score
            JOIN Content ON Content.content_parent_id = content_score.content_id
)
            SELECT cs.root_id AS id, c.content_description, MAX(t.title) AS title, SUM(cs.score)
            FROM content_score AS cs
            JOIN Content AS c ON c.id = cs.root_id
            JOIN Thread AS t ON t.content_id = c.id
            GROUP BY cs.root_id, c.content_description
            ORDER BY SUM(cs.score) DESC;
   
`;
      
const transformedContents = contents.map((content) => ({
  thread: { id: content.id },
  content_description: content.content_description,
  title: content.title
}));
      
      console.log("Inside prisma ", transformedContents)
      return transformedContents;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  
  async findThread(id: number, search_user_id: number) {
    const content_threads = await this.prisma.thread.findUnique({
      where: { id },
      include: {
        content: {
          select: {
            created_at: true,
            updated_at: true,
            owner_user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            views: true,
            content_description: true,
            _count: {
              select: { like: true },
            },
          },
        },
      },
    });
    
    if (!content_threads) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    
    const liked = await this.prisma.like.findFirst({
      where: {
        content_id: content_threads.content_id,
        user_id: search_user_id,
      },
    });
    
    const comments = await this.comment.findAllByContentParentId(id);
    
    return {
      ...content_threads,
      liked,
      comments,
    };
  }
  
  // Should we make these transactions
  async createThread(postData: CreateThreadDto, userId: number) {
    const content = await this.prisma.content.create({
      data: {
        content_description: postData.content_description,
        owner_user_id: userId,
      },
    });
    if (!content) {
      throw new ValidationException('No Content', HttpStatus.NOT_FOUND);
    }
    const thread = await this.prisma.thread.create({
      data: {
        title: postData.title,
        content_id: content.id,
      },
    });
    if (!thread) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return;
  }
  // updating just the view count
  async patchThreadView(id: number) {
    const content = await this.prisma.thread.update({
      where: { id },
      data: {
        content: { update: { views: { increment: 1 } } },
      },
    });
    
    if (!content) {
      throw new ValidationException('No Content', HttpStatus.NOT_FOUND);
    }
    return;
  }
  
  // Should we make these transactions
  async patchThread(putData: CreateThreadDto, id: number) {
    const content = await this.prisma.content.update({
      where: { id },
      data: { content_description: putData.content_description },
    });

    if (!content) {
      throw new ValidationException('No Content', HttpStatus.NOT_FOUND);
    }

    const thread = await this.prisma.thread.updateMany({
      where: { content_id: content.id },
      data: { title: putData.title },
    });

    if (!thread) {
      throw new ValidationException('No Thread', HttpStatus.NOT_FOUND);
    }
    return;
  }

  async deleteThread(id: number) {
    const content_threads = await this.prisma.content.delete({
      where: { id },
    });

    if (!content_threads) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return `Thread with ID ${id} was successful deleted`;
  }
}


// -- WITH RECURSIVE thread_score AS (
//   --   SELECT
//   --     id AS parent_id,
//   --     SUM(MATCH(Content.content_description) AGAINST(${word} IN BOOLEAN MODE)) AS score
//   --   FROM Content
//   --   WHERE content_parent_id IS NULL
//   --   UNION
//   --   SELECT
//   --     thread_score.parent_id,
//   --     MATCH(Content.content_description) AGAINST(${word} IN BOOLEAN MODE) as score
//   --   FROM Content
//   --   JOIN Comment ON Content.id = Comment.content_id
//   --   GROUP BY thread_score.parent_id
//   -- )
  
//   -- SELECT *
//   -- FROM thread_score;
  
  
  
//   -- WITH RECURSIVE
//   --       thread_score AS (
//   --       SELECT SUM(ORDER BY MATCH(Content.content_description) AGAINST(${word} IN BOOLEAN MODE)) AS score, id AS parent_id
//   --       FROM Content
//   --       WHERE content_parent_id IS NULL
//   --          UNION
//   --       SELECT ORDER BY MATCH(Content.content_description) AGAINST(${word} IN BOOLEAN MODE) as score, id AS parent_id
//   --       FROM Content
//   --       JOIN Comment ON Content.id = Comment.content_id
//   --       GROUP BY parent_id
//   --       )
  
//   --       SELECT *
//   --       FROM thread_score;