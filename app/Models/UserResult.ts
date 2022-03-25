import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Level from './Level'
import Question from './Question'

export default class UserResult extends BaseModel {
  /**
   * Column Defination
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number
  
  @column()
  public levelId: number

  @column()
  public questionId: number

  @column()
  public isCorrect: boolean

  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationship Defination
   */
  // One to Many relationship with 'User' model as child table of 'User' model
  @belongsTo(()=>User,{
    localKey:'userId'
  })
  public user: BelongsTo<typeof User>

  /**
   * One to Many relationship with 'Level' model
   * This model used as child Table of 'levels' DB
   */
  @belongsTo(()=>Level,{
    localKey:'levelId'
  })
  public level: BelongsTo<typeof Level>

  /**
   * One to Many relationship with 'Question' model
   * This model used as child table of 'questions' DB
   */
  @belongsTo(()=>Question,{
    localKey:'questionId'
  })
  public question: BelongsTo<typeof Question>

}
