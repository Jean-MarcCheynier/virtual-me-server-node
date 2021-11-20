/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IUser, Role } from '@virtual-me/virtual-me-ts-core';
import bcrypt from 'bcrypt';



export interface IUserDocument extends IUser, Document {
  comparePassword: (password: string) => Promise<IUserDocument|any>
}

export const schema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: false },
  role: { type: Role, default: Role.USER, enum: Role,required: true },
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profile: {
    github: {
      id: String,
      displayName: String,
      username: String,
      profileUrl: String,
      photos: [{ value: String }],
      provider: String
    }
  },
  session: { type: Schema.Types.Mixed, required: false }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  });


schema.pre<IUserDocument>('save', function (next: any) {
  if (this.isModified('password') || this.isNew && this.password) {
    bcrypt.genSalt(10, (err: any, salt: any) => {
      if (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next(err)
      }
      const password: string = this.password || '';
      bcrypt.hash(password, salt, (err: any, hash: any) => {
        if (err) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return next(err)
        }
        this.password = hash
        next()
      })
    })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return next()
  }
})

schema.methods.comparePassword = function (pw: any) {
  return new Promise((resolve, reject) => {
    const password: string = this.password || '';
    bcrypt.compare(pw, password, (err: any, isMatch: any) => {
      if (err) {
        reject(err)
      }
      if (isMatch) {
        resolve(this)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject("Password don't match")
      }
    })
  })
}

schema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}


export default model<IUserDocument> ('User', schema);
