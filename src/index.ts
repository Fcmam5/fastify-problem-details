import fp from 'fastify-plugin';
import { ProblemDetail, problemReply } from './reply-decorator';

declare module 'fastify' {
  interface FastifyReply {
    problem(problemDetailDTO: ProblemDetail): FastifyReply;
  }
}

export default fp(problemReply, '>=3.x');
