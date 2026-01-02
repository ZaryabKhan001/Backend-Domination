import Product from '../models/product.model.js';

export const handleAddSampleProducts = async (req, res) => {
  try {
    const products = [
      {
        title: 'Wireless Mouse',
        price: 1499,
        instock: true,
        category: 'Electronics',
      },
      {
        title: 'Bluetooth Headphones',
        price: 2999,
        instock: false,
        category: 'Electronics',
      },
      {
        title: 'Water Bottle',
        price: 599,
        instock: true,
        category: 'Home & Kitchen',
      },
      {
        title: 'Running Shoes',
        price: 3999,
        instock: true,
        category: 'Sports',
      },
      {
        title: 'Notebook',
        price: 199,
        instock: true,
        category: 'Stationery',
      },
      {
        title: 'Backpack',
        price: 2499,
        instock: false,
        category: 'Fashion',
      },
      {
        title: 'Smartwatch',
        price: 7499,
        instock: true,
        category: 'Electronics',
      },
      {
        title: 'Coffee Mug',
        price: 349,
        instock: true,
        category: 'Home & Kitchen',
      },
      {
        title: 'Yoga Mat',
        price: 1299,
        instock: true,
        category: 'Sports',
      },
      {
        title: 'Desk Lamp',
        price: 1599,
        instock: false,
        category: 'Home & Kitchen',
      },
      {
        title: 'Ballpoint Pen',
        price: 49,
        instock: true,
        category: 'Stationery',
      },
      {
        title: 'Casual T-Shirt',
        price: 899,
        instock: true,
        category: 'Fashion',
      },
    ];
    const result = await Product.insertMany(products);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Failed to insert sample products',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Products Added Successfully',
    });
  } catch (error) {
    console.log('Products Insertion Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Products Insertion Failed',
    });
  }
};

export const handleGetProductStat = async (req, res) => {
  try {
    // get all products that are instock as well as there price is higher than 1000.
    const stat = await Product.aggregate([
      {
        $match: {
          inStock: true,
          price: {
            $gt: 1000,
          },
        },
      },
      {
        $group: {
          _id: '$category',
          totalProducts: {
            $sum: 1,
          },
          averagePrice: {
            $avg: '$price',
          },
        },
      },
    ]);

    if (!stat) {
      return res.status(500).json({
        success: false,
        message: 'Fetching Product Stats Failed',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Products stats fetched sucessfully',
      data: stat,
    });
  } catch (error) {
    console.log('Fetching Product Stats Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Fetching Product Stats Failed',
    });
  }
};

export const handleGetProductAnalysis = async (req, res) => {
  try {
    // get all products that are in Electronics category
    // total revenue of that category
    // avg price of this category
    // max price of this category
    //* $project is mainly about controlling what the documents look like after transformation. (Including, Excluding and compute new ones)
    const analysis = await Product.aggregate([
      {
        $match: {
          category: 'Electronics',
        },
      },
      {
        $group: {
          _id: null,
          averagePrice: {
            $avg: '$price',
          },

          totalRevenue: {
            $sum: '$price',
          },
          minProductPrice: {
            $min: '$price',
          },
          maxProductPrice: {
            $max: '$price',
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          averagePrice: 1,
          priceRange: {
            $subtract: ['$maxProductPrice', '$minProductPrice'],
          },
        },
      },
    ]);

    if (!analysis) {
      return res.status(500).json({
        success: false,
        message: 'Fetching Product Analysis Failed',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Products Analysis fetched sucessfully',
      data: analysis,
    });
  } catch (error) {
    console.log('Fetching Product Analysis Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Fetching Product Analysis Failed',
    });
  }
};
