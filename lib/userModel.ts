import mongoose, { Schema, model, models } from "mongoose"
export const dataSchema = new Schema({
  id: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: String, required: true },
  email: String,
  companyEmail: String,
  officeEmail: String,
  cinPanGst: String,
  agreeToTerms: Boolean,
  isRecruiter: Boolean,
  isVerified: Boolean,
  updatedAt: { type: String, required: true },
  remarks: String,
  favouriteCourses: [String],
})

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  data:[dataSchema]
})

export const User = models.User || model("User", UserSchema)

// const AdminSchema = new Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   data: [dataSchema], // Embedded schema
// });

// export const Admin = models.Admin || model("Admin", AdminSchema);