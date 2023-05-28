import mongoose, { Model, Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

type IUser = {
  name: string;
  email: string;
  image: {
    src: string;
  };
  password: string;
  orders: Types.ObjectId[];
};

type IUserMethods = {
  isPasswordValid(inputPassword: string): Promise<boolean>;
};

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "User name field is required."],
    minlength: [5, "User name field must be at least 5 characters."],
    maxlength: [30, "User name field must be at most 30 characters."],
    validate: {
      validator: function (val: string) {
        return validator.isAlphanumeric(val, "en-US", { ignore: " .-" });
      },
      message: "User name field must contain only alphanumeric characters, spaces, dots, and dashes.",
    },
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User email field is required."],
    validate: {
      validator: function (val: string) {
        return validator.isEmail(val);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email address.`,
    },
    lowercase: true,
    trim: true,
  },
  image: {
    src: {
      type: String,
    },
  },
  password: {
    type: String,
    required: [true, "User password field is required."],
    minlength: [8, "User password field must be at least 8 characters."],
    maxlength: [100, "User password field must be at most 100 characters."],
    select: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

userSchema.methods.isPasswordValid = async function (inputPassword) {
  const isValid = await bcrypt.compare(inputPassword, this.password);
  return isValid;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
