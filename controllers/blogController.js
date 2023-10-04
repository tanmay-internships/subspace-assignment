const { default: axios } = require("axios");
const lodash = require("lodash");

// async method to get real time blog data ---(can be done in synchronous way at startup as data is not changing)
const getBlogs = async (req, res, next) => {
    try {
        // making axios request on mentioned url to fetch blogs
        const results = await axios({
            method: "get",
            headers: {
                "x-hasura-admin-secret":
                    "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
            },
            url: "https://intent-kit-16.hasura.app/api/rest/blogs",
        });
        return results.data.blogs;
    } catch (error) {
        throw error;
    }
};

// controller for stats route
exports.statsController = async (req, res, next) => {
    try {
        // getting blogs
        const blogs = await getBlogs(req, res, next);

        // performing operations mentioned  in problem statement
        const TotalNumberofBlogs = lodash.size(blogs);

        const LongestBlog = lodash.maxBy(blogs, (blog) => blog.title.length);
        const blogsWithPrivacy = lodash.filter(blogs, (blog) =>
            lodash.includes(blog.title.toLowerCase(), "privacy")
        );
        const NumberOfBlogsWithPrivacy = lodash.size(blogsWithPrivacy);

        const UniqueBlogTitles = lodash
            .uniqBy(blogs, "title")
            .map((blog) => blog.title);

        // sending response
        res.status(200).json({
            status: "sucess",
            data: {
                TotalNumberofBlogs,
                TitleOfLongestBlog: LongestBlog.title,
                NumberOfBlogsWithPrivacy,
                UniqueBlogTitles,
            },
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// controller for search route
exports.searchController = async (req, res, next) => {
    try {
        // fetching the blogs
        const blogs = await getBlogs();

        // getting the query value
        const query = req.query.query.toLowerCase();

        //  searching for query value
        const BlogsWithQuery = blogs.filter((blog) => {
            if (blog.title.toLowerCase().includes(query)) {
                return blog;
            }
        });

        // sending response
        res.status(200).json({
            status: "sucess",
            data: {
                NumberOfBlogs: BlogsWithQuery.length,
                BlogsWithQuery,
            },
        });
    } catch (error) {
        next(error);
    }
};
