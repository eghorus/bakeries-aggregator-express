import mongoose, { Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

type User = {
  name: string;
  email: string;
  image: {
    src: string;
  };
  password: string;
};

type UserModel = Model<User>;

const userSchema = new mongoose.Schema<User, UserModel>(
  {
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
        default: "",
      },
    },
    password: {
      type: String,
      required: [true, "User password field is required."],
      minlength: [8, "User password field must be at least 8 characters."],
      maxlength: [100, "User password field must be at most 100 characters."],
      select: false,
    },
  },
  {
    methods: {
      async isPasswordValid(inputPassword) {
        const isValid = await bcrypt.compare(inputPassword, this.password);
        return isValid;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
