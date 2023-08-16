import EErrors from "../services/errors/enums.js";

export default (err, req, res, next) => {
    const error = err;
    console.log(error.cause);

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;
        case EErrors.DATABASES_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;
        default:
            res.status(500).send({ status: "error", error: "Internal Server Error" });
            break;
    }
};