import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Level from 'App/Models/Level';
// import Option from 'App/Models/Option';
import User from 'App/Models/User';
// import UserResult from 'App/Models/UserResult';

export default class ResultsController {
    public async index({response,params}:HttpContextContract){
        /**
         * User Id validation
         */
        let userId = params.user_id;;
        try {
            userId = await User.findOrFail(userId);
            userId = userId.toJSON().id;
        } catch (error) {
            return response.json({
                message:'User is not Found !'
            });
        }
        
        /**
         * Level Name Validation
         */
        const levelName = params.level_name;
        let levelId;
        try {
            levelId = await Level.query().where('name',levelName).first();
            levelId = levelId.toJSON().id;
        } catch (error) {
            return response.json({
                message:"Level name is not valid!"
            });
        }

        /**
         * Level wise user's result 
         */
        let userResult;
        try {
            userResult = await Database.from('user_results').join('options',(query)=>{
                    query.on('user_results.option_id','=','options.id')
                }).where('user_results.user_id',userId).andWhere('options.is_ans',1).andWhere('user_results.level_id',levelId).count('* as total').first();
        } catch (error) {
            return response.json({
                message:"Server Side Problem !!"
            });
        }
        
        return response.json({
            data:userResult.total 
        });
    }
}
