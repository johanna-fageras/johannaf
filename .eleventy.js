module.exports = function (eleventyConfig) {
  // Copy assets directory to _site
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add collections
  eleventyConfig.addCollection("posts", function (collection) {
    return collection
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date); // Sort in reverse chronological order
  });

  // Create tag pages
  eleventyConfig.addCollection("tagList", function (collection) {
    const tagSet = new Set();
    collection.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags
        .filter((tag) => tag !== "post")
        .forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });

  // Add current year as global data
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

  // Add filters
  eleventyConfig.addFilter("dateFilter", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("dateToISO", function (date) {
    if (date instanceof Date) {
      return date.toISOString();
    }
    return new Date(date).toISOString();
  });

  eleventyConfig.addFilter("readingTime", function (content) {
    const wordsPerMinute = 200;
    const numberOfWords = content.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  eleventyConfig.addFilter("padNumber", function (number) {
    return number.toString().padStart(2, "0");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
