import { connect,  ConnectOptions} from 'mongoose'

export const dbconnect  = () => {
    connect(process.env.MONGO_URI!, {
        useNewUrlparser:true,
        useunifiedTopology:true
    } as ConnectOptions ).then(
        ()=> console.log("connect successfully"),
        (error)=>console.log(error)
    )
}