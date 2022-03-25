import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';


export default class AuthController {

    public async registerShow({response}:HttpContextContract){
        return response.json({msg: 'It is registerShow page'});
    }
    
    public async register({request,response,auth}:HttpContextContract){
        const userSchema = schema.create({
            username: schema.string({trim:true},[
                rules.unique({table:'users',column:'username',caseInsensitive:true})
            ]),
            email: schema.string({trim:true},[
                rules.email(),
                rules.unique({table:'users',column:'email',caseInsensitive:true}),
            ]),
            password:schema.string({},[rules.minLength(8)])
        });

        const validateData = await request.validate({schema: userSchema});

        const user = await User.create(validateData);

        await auth.login(user);
        
        return response.redirect().toRoute('/');
    }

    public async loginShow({response}:HttpContextContract){
        return response.json({msg:'It is login show page'});
    }

    public async login({request,auth,response,session  }:HttpContextContract){
        const userLoginSchema = schema.create({
            uid: schema.string({trim: true}),
            password: schema.string({trim:true},[ rules.minLength(8)])
        });

        const validateData = await request.validate({schema:userLoginSchema});

        try {
            await auth.attempt(validateData.uid, validateData.password);
        } catch (error) {
            session.flash('form','Your username, email, or password is incorrect')
            return response.redirect('/');
        }
        return response.redirect('/');
    }

    public async logout({response,auth}:HttpContextContract){
        await auth.logout();
        return response.redirect('/')

    }
}