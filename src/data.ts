

export const Sample_Foods: any[] = [
    {
        id: "1",
        name: "Pizza",
        price: 10,
        tags: ["FastFood", "Pizza", "Lunch"],
        favorite: true,
        stars: 4.5,
        imageUrl: "/assets/food-1.jpg",
        origins: ["Italy"],
        cooktime: "10-20"
    },
    {
        id: "2",
        name: "Burger",
        price: 8,
        tags: ["FastFood", "Burger", "Lunch"],
        favorite: false,
        stars: 4.0,
        imageUrl: "/assets/food-2.jpg",
        origins: ["USA"],
        cooktime: "15-25"
    },
    {
        id: "3",
        name: "Sushi",
        price: 12,
        tags: ["Japanese", "Sushi", "Dinner"],
        favorite: true,
        stars: 4.8,
        imageUrl: "/assets/food-3.jpg",
        origins: ["Japan"],
        cooktime: "20-30"
    }
]

export const Sample_Tags:any[] = [
    { name: "FastFood", count: 10 },
    { name: "Pizza", count: 5 },
    { name: "Burger", count: 8 },
    { name: "Japanese", count: 3 },
    { name: "Sushi", count: 4 },
    { name: "Lunch", count: 6 },
    { name: "Dinner", count: 2 }
]

export const Sample_Users:any[] = [
    {
        id: "1",
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "password123",
        address: "123 Main St, City, Country",
        phone: "123-456-7890",
        isAdmin: false
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "janesmith@gmail.com",
        password: "password456",
        address: "456 Elm St, City, Country",
        phone: "987-654-3210",
        isAdmin: true
    }
]
