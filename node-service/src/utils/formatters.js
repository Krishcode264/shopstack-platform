/**
 * Format a user object for API response.
 */
function paginate(page = 1, limit = 10) {
  const actualPage = Math.max(1, parseInt(page, 10) || 1);
  const actualLimit = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (actualPage - 1) * actualLimit;
  return { page: actualPage, limit: actualLimit, offset };
}

function formatUserResponse(user) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.profile?.avatar ?? null,
    bio: user.profile?.bio ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
    description: product.description,
    price: parseFloat(product.price),
    stock: product.stock,
    category: product.category,
    createdAt: product.createdAt,
  };
}

/**
 * Build pagination metadata.
 */
function paginate(page, limit) {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;

  const offset = parsedPage * parsedLimit;

  return {
    limit: parsedLimit,
    offset: offset,
    page: parsedPage,
  };
}

module.exports = {
  formatUserResponse,
  formatProductResponse,
  paginate,
};