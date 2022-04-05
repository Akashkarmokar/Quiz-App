import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import Level from 'App/Models/Level'
import UserResult from 'App/Models/UserResult'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({ response, params }: HttpContextContract) {
    const userDetails = await User.query().where('username', params.username).preload('results')

    return response.json({
      data: userDetails.length ? userDetails : 'Invalid Username',
    })
  }
  /**
   * Return User's result by level
   * Get user_id from request parameter
   * Get level_name as from request parameter
   */
  public async levelResults({ request, response, auth }: HttpContextContract) {
    /**
     * Validation Schema
     */
    const levelResultSchema = schema.create({
      userId: schema.number(),
      levelName: schema.enum(['easy', 'medium', 'hard'] as const),
    })

    /**
     * Validate Payload
     */
    let payload
    try {
      payload = await request.validate({ schema: levelResultSchema })
    } catch (error) {
      response.status(400)
      return response.json({
        error: [{ message: 'Schema Validation faild' }],
      })
    }

    /**
     * Though this controller handler invoke only by loggedIn user.
     * Here We check again is User loggedIn or not
     */
    if (auth.isLoggedIn) {
      const logginUserData = auth.user?.toJSON()

      /**
       * If payload userId and auth.userId matched
       */

      /**
       * Editor may say logginUserData undefined but it is not possible , because
       * we are in loggedIn user Block
       */
      if (logginUserData.id == payload.userId) {
        const userId = logginUserData.id;

        /**
         * Get LevelId and also checking levelName valid or not
         */
        const levelName = payload.levelName;
        let levelId;
        try {
          levelId = await Level.query().where('name', levelName).first()
          levelId = levelId.toJSON().id
        } catch (error) {
          return response.json({
            message: 'Level name is not valid!',
          })
        }

        let userResult;
        try {
          userResult = await Database.from('user_results')
            .join('options', (query) => {
              query.on('user_results.option_id', '=', 'options.id')
            })
            .where('user_results.user_id', userId)
            .andWhere('options.is_ans', 1)
            .andWhere('user_results.level_id', levelId)
            .count('* as total')
            .first()
        } catch (error) {
          return response.json({
            message: 'Server Side Problem !!',
          })
        }
        return response.json({
          data: userResult.total,
        })
      } else {
        // If it is not matched
        return response.json({
          error: [{ message: 'You are not valid for this information..!' }],
        })
      }
    } else {
      // If User is not loggedIn
      return response.json({
        error: [{ validation: 'User is not loggedIn...!!' }],
      })
    }
  }

  /**
   * Return User's All choices by level
   *
   */
  public async levelChoices({ request, response, auth }: HttpContextContract) {
    /**
     * Validation Schema
     */
    const levelChoiceSchema = schema.create({
      userId: schema.number(),
      levelName: schema.enum(['easy', 'medium', 'hard'] as const),
    })

    /**
     * Validate Payload
     */
    const payload = await request.validate({ schema: levelChoiceSchema })

    /**
     * Though this controller handler invoke only by loggedIn user,
     * We again check user is loggedIn or not
     */
    if (auth.isLoggedIn) {
      const logginUserData = auth.user?.toJSON()
      /**
       * If payload userId and loggedin User id match we go ahead
       * (If loggedIn user send payload with annonymus userId)
       */

      /**
       * Editor may say logginUserData undefined but it is not possible , because
       * we are in loggedIn user Block
       */
      if (logginUserData.id == payload.userId) {
        const userId = logginUserData.id
        /**
         * Level Name Validation
         */
        const levelName = payload.levelName
        let levelId
        try {
          levelId = await Level.query().where('name', levelName).first()
          levelId = levelId.toJSON().id
        } catch (error) {
          return response.json({
            message: 'Level name is not valid!',
          })
        }

        let choice
        try {
          choice = await UserResult.query()
            .where('user_id', userId)
            .andWhere('level_id', levelId)
            .preload('question')
            .preload('option')
        } catch (error) {
          return response.json({
            message: 'Server side problem !!',
          })
        }
        return response.json({
          data: choice,
        })
      } else {
        return response.json({
          error: [{ message: 'Your are not valid for this information..!!' }],
        })
      }
    } else {
      // If user is not loggedIn
      return response.json({
        error: [{ validation: 'User is not loggedIn...!!' }],
      })
    }
  }
}
