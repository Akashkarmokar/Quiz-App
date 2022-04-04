import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class Guest {
  public async handle({auth,response,request,}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    
    if(auth.isLoggedIn){
      if(request.url()=='/register'){
        return response.json({message:'Logout First....!!'});
      }
      return response.json({message:'User Is Already LoggedIn !!'});
    }
    await next()
  }
}
