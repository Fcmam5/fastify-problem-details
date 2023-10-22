/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance, FastifyPluginCallback } from 'fastify';

// As specified in https://datatracker.ietf.org/doc/html/rfc7807#section-3.1
export interface IProblemDetailDTO {
  status: number;
  title: string;
  type: string;
  detail: string;
  instance: string;
  [key: string]: unknown;
}

// All fields are optional: https://www.rfc-editor.org/rfc/rfc7807#section-6.1
export type ProblemDetail = Partial<IProblemDetailDTO>;

export interface ProblemReplyPlugin {
  baseURI?: string;
}

export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

export const problemReply: FastifyPluginCallback<ProblemReplyPlugin> = (
  fastify: FastifyInstance,
  options: ProblemReplyPlugin,
  done,
) => {
  if (options.baseURI && !URL.canParse(options.baseURI)) {
    throw `Invalid URI (${options.baseURI})`;
  }

  fastify.decorateReply('problem', function (dto: ProblemDetail) {
    dto.type = dto.type || 'about:blank'; // TODO: auto-type?
    dto.status = dto.status || 500;

    return this.code(dto.status).type(PROBLEM_CONTENT_TYPE).send(dto);
  });

  done();
};
