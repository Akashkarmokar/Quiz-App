import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Level from 'App/Models/Level'
import Question from 'App/Models/Question'
import UserResult from 'App/Models/UserResult'
import { schema,rules } from '@ioc:Adonis/Core/Validator'

export default class QuestionsController {
    public async index({response,params,auth}:HttpContextContract){
        console.log(auth.user);
        const levelName = params.level_name;
        // const level = await Level.query().where('name',levelName).preload('questions').preload('options');
        const levelId = await Level.query().where('name',levelName);
        // console.log(levelId);
        const questions = await Question.query().where('levelId',levelId[0].$original.id).preload('options',(query)=>{
            query.select('id','question_id','title')
        }).limit(10).select('id','level_id','title');
        // const questions = await Question.query().where('levelId',levelId[0].$original.id).preload('options').limit(10);
        return response.json({questions});
        // return response.json({msg: "HELLO"});
    }
    public async store({request,response,auth}:HttpContextContract){
        // if(auth.user){
        //     return response.json({msg: 'User Log in'});
        // }
        // return response.json({msg:'User log out '});
        
        const dataSchema = schema.create({
            data: schema.array().members(
                schema.object().members({
                    // userId: schema.number([rules.exists({table:'user_results',column:'user_id'})]),
                    userId: schema.number(),
                    // levelId:schema.number([rules.exists({table:'user_results',column:'level_id'})]),
                    levelId: schema.number(),
                    questionId:schema.number(),
                    optionId:schema.number(),
                })
            ),
        });

        const validateData = await request.validate({schema:dataSchema});
        console.log(validateData);
        // return response.json({msg:'Hello'});
        const userId = validateData.data[0].userId;
        const levelId = validateData.data[0].levelId;
        const result = await UserResult.query().andWhere('userId',userId).andWhere('levelId',levelId);
        // console.log(result.length);
        // return response.json(result);
        if(result.length == 0){
            await UserResult.createMany(validateData.data);
            return response.json({
                message:"Successfully Addedd user result",
            });
        }else{
            return response.json({
                message:"User Already play this level !!",
            });
        }

    }
}
