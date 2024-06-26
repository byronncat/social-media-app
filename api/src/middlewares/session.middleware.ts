import { Request, Response } from 'express';
import { signedCookie } from 'cookie-parser';

import { StatusCode } from '@constants';
import { jwt } from '@libraries';
import { logger } from '@utilities';
import { getSession, removeSession } from '@/database/access';

import { TIME } from '@constants';
import type { API, Identity } from '@types';

export function save(req: Request, res: Response) {
  const user = res.locals.user as Identity['user'];
  req.session.user = { id: user!.id };
  res.cookie('user', jwt.generateToken(user!), {
    maxAge: TIME.COOKIE_MAX_AGE,
  });
}

export async function destroy(
  req: Request,
  res: Response,
): Promise<Response<API>> {
  try {
    const sessionCookie = req.cookies.session_id;
    const sessionId = signedCookie(
      sessionCookie,
      process.env.TOKEN_SECRET || 'secret',
    );

    if (!sessionId) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const removedSessions = await removeSession(sessionId);
    if (removedSessions > 0) {
      res.clearCookie('session_id');
      res.clearCookie('user');

      return res.status(StatusCode.OK).json({
        success: true,
        message: 'Logged out',
      });
    } else {
      return res.status(StatusCode.OK).json({
        success: true,
        message: 'No session found or already logged out',
      });
    }
  } catch (error) {
    logger.error(JSON.stringify(error), 'Session Token Middleware');
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error, logout failed',
    });
  }
}

export async function authenticate(
  req: Request,
  res: Response,
): Promise<Response<API>> {
  let result = {
    statusCode: StatusCode.OK,
    respond: {
      success: false,
      message: 'Unauthorized',
    } as API,
  };
  try {
    const sessionCookie = req.cookies.session_id;
    const sessionId = signedCookie(
      sessionCookie,
      process.env.TOKEN_SECRET || 'secret',
    );

    if (sessionId) {
      if (await getSession(sessionId)) {
        result = {
          statusCode: StatusCode.OK,
          respond: {
            success: true,
            message: 'Authorized',
          },
        };
      }
    }
  } catch (error) {
    logger.error(JSON.stringify(error), 'Session Token Middleware');
    result = {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      respond: {
        success: false,
        message: 'Internal server error, authentication failed',
      },
    };
  }

  return res.status(result.statusCode).json(result.respond);
}
