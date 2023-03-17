const PostDAO = require('../DAO/PostDAO')

exports.getAllPost = async (req, res) => {
    console.log(req.query);
    const {page,pageSize,totalPage,totalItem,posts} = await PostDAO.getAllPost(req.query);

    res.status(200).json({
        //200 - OK
        status: 'success',
        page,
        pageSize,
        totalPage,
        totalItem,
        data: {
            posts
        },
    });
} 