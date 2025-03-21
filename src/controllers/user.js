import { asynchandle } from "../utils/asynchandler.js";

const register = asynchandle(async (req, res) => {
    res.status(200).json({message:"welldone"});
}
);

export {register};