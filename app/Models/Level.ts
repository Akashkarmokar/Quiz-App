import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Question from './Question'
import UserResult from './UserResult'

export default class Level extends BaseModel {
  /**
   * Column Defination
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationship Defination
   */
  /**
   * One to Many relationship with Question Model
   * Here It is used as Parent Table of Question Model 
   */
  @hasMany(() => Question,{
    foreignKey:'levelId'
  })
  public questions: HasMany<typeof Question>

  // One to Many relationship with UserResult Model
  @hasMany(()=> UserResult,{
    foreignKey:'levelId'
  })
  public results: HasMany<typeof UserResult>


}
