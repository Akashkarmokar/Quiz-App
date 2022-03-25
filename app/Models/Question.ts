import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Level from './Level'
import Option from './Option'
import UserResult from './UserResult'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public levelId: number

  @column()
  public title: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationship Defination
   */


  /**
   * One To Many relationship with Level Model 
   * Here it is Child Table of Level Model
   */
  @belongsTo(()=>Level,{
    localKey:'levelId'
  })
  public level: BelongsTo<typeof Level>

  /**
   * One to Many Relationship with 'Option' Model
   * It used as parent table of 'Option' model
   */
  @hasMany(()=> Option,{
    foreignKey:'questionId'
  })
  public options: HasMany<typeof Option>

  /**
   * One to Many relationship with 'UserResult'Model 
   * It used as Parent table of 'user_results' DB
   */
  @hasMany(()=>UserResult,{
    foreignKey:'questionId'
  })
  public results: HasMany<typeof UserResult>
}
