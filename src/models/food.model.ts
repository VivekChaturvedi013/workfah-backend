import { model, Schema } from "mongoose";

export interface Food {
    id: string;
    name: string;
    price: number;
    tags: string[];
    favorite: boolean;
    stars: number;
    imageUrl: string;
    origins: string[];
    cooktime: string;
}

export const FoodScheme = new Schema<Food>(
    {
        name: { type:String, required:true},
        price: { type:Number, required:true},
        tags: { type:[String]},
        favorite: { type:Boolean, required:false},
        stars: { type:Number, required:true},
        imageUrl: { type:String, required:true},
        origins: { type:[String], required:true},
        cooktime: { type:String, required:true},
    },
    {
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    }
);

export const FoodModel = model<Food>('food', FoodScheme);

