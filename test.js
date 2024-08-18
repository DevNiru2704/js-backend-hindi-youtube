const avatar = "https://res.cloudinary.com/demo/image/upload/v1622231047/sample_avatar.jpg";
const publicId=avatar.split('/').pop().split('.')[0]
console.log(publicId)