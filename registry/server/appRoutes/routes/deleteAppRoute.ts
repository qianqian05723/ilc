import {
    Request,
    Response,
} from 'express';
import Joi from 'joi';
import * as httpErrors from '../../errorHandler/httpErrors';

import db from '../../db';
import validateRequestFactory from '../../common/services/validateRequest';
import {
    appRouteIdSchema,
} from '../interfaces';

type DeleteAppRouteRequestParams = {
    id: string
};

const validateRequestBeforeDeleteAppRoute = validateRequestFactory([{
    schema: Joi.object({
        id: appRouteIdSchema,
    }),
    selector: 'params',
}]);

const deleteAppRoute = async (req: Request<DeleteAppRouteRequestParams>, res: Response) => {
    const appRouteId = req.params.id;

    await db.versioning(req.user, {type: 'routes', id: appRouteId}, async (transaction) => {
        await db('route_slots').where('routeId', appRouteId).delete().transacting(transaction);
        const count = await db('routes').where('id', appRouteId).delete().transacting(transaction);
        if (!count) {
            throw new httpErrors.NotFoundError()
        }
    });

    res.status(204).send();
};

export default [validateRequestBeforeDeleteAppRoute, deleteAppRoute];
