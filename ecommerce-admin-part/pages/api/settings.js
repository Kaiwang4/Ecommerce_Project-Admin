import { mongooseConnect } from "@/lib/mongoose";
import { Setting } from "@/model/Setting";
// import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
    try {
        await mongooseConnect();
        // await isAdminRequest(req, res);

        if(req.method === 'PUT') {
            const {name, value} = req.body;
            const settingDoc = await Setting.findOne({name});
            if (settingDoc) {
                settingDoc.value = value;
                await settingDoc.save();
                res.json(settingDoc);
            } else {
                const newSetting = await Setting.create({name, value});
                res.json(newSetting);
            }
        }

        if (req.method === 'GET') {
            const {name} = req.query
            res.json( await Setting.findOne({name}))
        }
    } catch (error) {
        console.error(error);
        // Respond with the error details or a generic message
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}


