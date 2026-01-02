import ApiError from '../middleware/error.middleware.js';

const products = [
  {
    id: 1,
    name: 'Item 1',
  },
  {
    id: 2,
    name: 'Item 2',
  },
  {
    id: 3,
    name: 'Item 3',
  },
  {
    id: 4,
    name: 'Item 4',
  },
  {
    id: 5,
    name: 'Item 5',
  },
];

export const handleGetProducts = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: products,
  });
};

export const handleAddProduct = (req, res) => {
  if (!req.body.name) {
    return new ApiError(400, false, 'Invalid Request');
  }
  products.unshift({ id: Math.random(), name: req.body.name });
  return res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: 'Product added successfully',
  });
};
