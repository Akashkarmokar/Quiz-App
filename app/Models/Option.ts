import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Question from './Question'

export default class Option extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public questionId: number

  @column()
  public title: string

  @column()
  isAns: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * One to Many relationship with 'Question' Model
   * It used as child table of 'Question' Model
   */
  @belongsTo(()=>Question,{
    localKey:'questionId'
  })
  public question: BelongsTo<typeof Question>
  
}
