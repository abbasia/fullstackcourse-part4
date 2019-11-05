const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  const reducer = (previous, current) => {
    return previous.likes > current.likes ? previous : current;
  };
  return blogs.reduce(reducer);
};

const mostBlogs = blogs => {
  const authors = blogs.map(b => b.author);
  const uniqueAuthors = [...new Set(authors)];

  const authorAndBlogCount = uniqueAuthors.map(author => {
    const count = authors.filter(a => a === author).length;
    return { author, blogs: count };
  });

  const authorWithMostBlogs = authorAndBlogCount.reduce((previous, current) => {
    return previous.blogs > current.blogs ? previous : current;
  });

  return authorWithMostBlogs;
};

const mostLikes = blogs => {
  const authors = blogs.map(b => b.author);
  const uniqueAuthors = [...new Set(authors)];

  const authorsWithLikes = uniqueAuthors.map(author => {
    const reducer = (sum, blog) => {
      return author === blog.author ? sum + blog.likes : sum;
    };
    const likes = blogs.reduce(reducer, 0);
    return { author, likes };
  });

  const authorWthMostLikes = authorsWithLikes.reduce((previous, current) => {
    return previous.likes > current.likes ? previous : current;
  });

  return authorWthMostLikes;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
