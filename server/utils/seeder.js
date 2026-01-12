const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    }
];

const products = [
    // Electronics
    { name: 'Apple MacBook Pro 16"', description: 'The most powerful MacBook Pro ever with M3 Pro chip, Liquid Retina XDR display, exceptional battery life.', price: 2499.99, originalPrice: 2699.99, category: 'Electronics', brand: 'Apple', images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', alt: 'MacBook Pro' }], stock: 25, ratings: 4.8, numReviews: 156, featured: true },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with Auto NC Optimizer and crystal clear hands-free calling.', price: 349.99, originalPrice: 399.99, category: 'Electronics', brand: 'Sony', images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Sony Headphones' }], stock: 50, ratings: 4.7, numReviews: 234, featured: true },
    { name: 'Samsung Galaxy S24 Ultra', description: 'Galaxy S24 Ultra with Galaxy AI. The most powerful Galaxy smartphone yet.', price: 1299.99, originalPrice: 1399.99, category: 'Electronics', brand: 'Samsung', images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: 'Samsung Galaxy' }], stock: 35, ratings: 4.6, numReviews: 445, featured: true },
    { name: 'iPad Air M2', description: 'The new iPad Air with powerful M2 chip brings incredible performance in an ultraportable design.', price: 599.99, originalPrice: 649.99, category: 'Electronics', brand: 'Apple', images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', alt: 'iPad Air' }], stock: 60, ratings: 4.8, numReviews: 423, featured: true },
    { name: 'Bose QuietComfort Ultra Earbuds', description: 'World-class noise cancellation with spatial audio and CustomTune sound calibration.', price: 299.99, originalPrice: 329.99, category: 'Electronics', brand: 'Bose', images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', alt: 'Bose Earbuds' }], stock: 80, ratings: 4.6, numReviews: 356, featured: false },
    { name: 'LG OLED 65" 4K Smart TV', description: 'Self-lit OLED pixels deliver perfect blacks and infinite contrast for stunning picture quality.', price: 1799.99, originalPrice: 2199.99, category: 'Electronics', brand: 'LG', images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', alt: 'LG OLED TV' }], stock: 15, ratings: 4.9, numReviews: 287, featured: true },

    // Clothing
    { name: 'Nike Air Max 270', description: 'The Nike Air Max 270 delivers visible cushioning under every step with modern comfort.', price: 159.99, originalPrice: 179.99, category: 'Clothing', brand: 'Nike', images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'Nike Air Max' }], stock: 100, ratings: 4.5, numReviews: 789, featured: true },
    { name: 'The North Face Nuptse Jacket', description: '700-fill responsibly sourced goose down jacket with water-repellent finish.', price: 299.99, originalPrice: 349.99, category: 'Clothing', brand: 'The North Face', images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', alt: 'North Face Jacket' }], stock: 45, ratings: 4.7, numReviews: 567, featured: true },
    { name: "Levi's 501 Original Jeans", description: 'The original jean since 1873. The 501 has been worn by icons and become an icon itself.', price: 79.99, originalPrice: 99.99, category: 'Clothing', brand: "Levi's", images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', alt: 'Levi Jeans' }], stock: 150, ratings: 4.4, numReviews: 1234, featured: false },
    { name: 'Ralph Lauren Polo Shirt', description: 'Classic fit polo shirt in signature cotton mesh with iconic embroidered pony.', price: 98.50, originalPrice: 125.00, category: 'Clothing', brand: 'Ralph Lauren', images: [{ url: 'https://images.unsplash.com/photo-1625910513413-5fc45b7e1f3e?w=800', alt: 'Polo Shirt' }], stock: 200, ratings: 4.6, numReviews: 445, featured: false },
    { name: 'Gucci GG Marmont Belt', description: 'Leather belt with Double G buckle in antique gold-toned hardware.', price: 450.00, originalPrice: 520.00, category: 'Clothing', brand: 'Gucci', images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: 'Gucci Belt' }], stock: 30, ratings: 4.8, numReviews: 189, featured: true },

    // Home & Garden
    { name: 'Dyson V15 Detect Vacuum', description: "Dyson's most powerful cordless vacuum with laser dust detection.", price: 749.99, originalPrice: 849.99, category: 'Home & Garden', brand: 'Dyson', images: [{ url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', alt: 'Dyson Vacuum' }], stock: 20, ratings: 4.9, numReviews: 312, featured: true },
    { name: 'Vitamix A3500 Blender', description: 'Smart blender with touchscreen controls and self-detect technology.', price: 649.99, originalPrice: 749.99, category: 'Home & Garden', brand: 'Vitamix', images: [{ url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800', alt: 'Vitamix Blender' }], stock: 15, ratings: 4.9, numReviews: 189, featured: false },
    { name: 'Philips Hue Starter Kit', description: 'Smart LED bulbs with bridge, app control, and voice assistant compatibility.', price: 199.99, originalPrice: 229.99, category: 'Home & Garden', brand: 'Philips', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Philips Hue' }], stock: 65, ratings: 4.5, numReviews: 534, featured: false },
    { name: 'KitchenAid Stand Mixer', description: 'Iconic tilt-head stand mixer with 10 speeds and 5-quart stainless steel bowl.', price: 449.99, originalPrice: 499.99, category: 'Home & Garden', brand: 'KitchenAid', images: [{ url: 'https://images.unsplash.com/photo-1594965574725-e5097c7a5e51?w=800', alt: 'KitchenAid Mixer' }], stock: 40, ratings: 4.8, numReviews: 756, featured: true },
    { name: 'iRobot Roomba j7+', description: 'Self-emptying robot vacuum with obstacle avoidance and smart mapping.', price: 799.99, originalPrice: 899.99, category: 'Home & Garden', brand: 'iRobot', images: [{ url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', alt: 'Roomba' }], stock: 25, ratings: 4.6, numReviews: 423, featured: false },

    // Sports
    { name: 'Adidas Ultraboost 23', description: 'Incredible energy return with Light BOOST midsole and Primeknit+ upper.', price: 189.99, originalPrice: 219.99, category: 'Sports', brand: 'Adidas', images: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', alt: 'Adidas Ultraboost' }], stock: 75, ratings: 4.5, numReviews: 678, featured: false },
    { name: 'Peloton Bike+', description: 'Ultimate connected fitness with 24" rotating HD touchscreen and Auto-Follow resistance.', price: 2495.00, originalPrice: 2695.00, category: 'Sports', brand: 'Peloton', images: [{ url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', alt: 'Peloton Bike' }], stock: 10, ratings: 4.8, numReviews: 234, featured: true },
    { name: 'Wilson Pro Staff Tennis Racket', description: 'Professional-grade tennis racket with precision control and power balance.', price: 269.00, originalPrice: 299.00, category: 'Sports', brand: 'Wilson', images: [{ url: 'https://images.unsplash.com/photo-1617083934551-ac1f1c6479e5?w=800', alt: 'Tennis Racket' }], stock: 35, ratings: 4.7, numReviews: 156, featured: false },
    { name: 'Yeti Tundra 45 Cooler', description: 'Premium hard cooler with rotomolded construction and superior ice retention.', price: 325.00, originalPrice: 375.00, category: 'Sports', brand: 'Yeti', images: [{ url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', alt: 'Yeti Cooler' }], stock: 50, ratings: 4.9, numReviews: 312, featured: true },
    { name: 'Garmin Fenix 7 GPS Watch', description: 'Rugged multisport GPS smartwatch with advanced training features and maps.', price: 699.99, originalPrice: 799.99, category: 'Sports', brand: 'Garmin', images: [{ url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800', alt: 'Garmin Watch' }], stock: 45, ratings: 4.8, numReviews: 567, featured: true },

    // Books
    { name: 'Atomic Habits by James Clear', description: 'Proven framework for improving every day through tiny changes in behavior.', price: 18.99, originalPrice: 27.99, category: 'Books', brand: 'Penguin', images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', alt: 'Atomic Habits Book' }], stock: 500, ratings: 4.9, numReviews: 2345, featured: true },
    { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', price: 16.99, originalPrice: 24.99, category: 'Books', brand: 'Harriman House', images: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', alt: 'Psychology of Money' }], stock: 350, ratings: 4.8, numReviews: 1876, featured: true },
    { name: 'Clean Code by Robert Martin', description: 'A handbook of agile software craftsmanship for professional developers.', price: 39.99, originalPrice: 49.99, category: 'Books', brand: 'Pearson', images: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800', alt: 'Clean Code Book' }], stock: 200, ratings: 4.7, numReviews: 987, featured: false },
    { name: 'Sapiens: A Brief History', description: "Yuval Noah Harari's groundbreaking narrative of humanity's creation and evolution.", price: 22.99, originalPrice: 29.99, category: 'Books', brand: 'Harper', images: [{ url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800', alt: 'Sapiens Book' }], stock: 275, ratings: 4.8, numReviews: 3421, featured: true },
    { name: 'The Midnight Library', description: "Matt Haig's magical novel about parallel lives and second chances.", price: 14.99, originalPrice: 19.99, category: 'Books', brand: 'Viking', images: [{ url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800', alt: 'Midnight Library' }], stock: 180, ratings: 4.6, numReviews: 1543, featured: false },

    // Beauty
    { name: 'Dyson Airwrap Complete', description: 'Multi-styler with Coanda air technology for curls, waves, and smooth blowouts.', price: 599.99, originalPrice: 649.99, category: 'Beauty', brand: 'Dyson', images: [{ url: 'https://images.unsplash.com/photo-1522338242042-2d1c60f10c95?w=800', alt: 'Dyson Airwrap' }], stock: 30, ratings: 4.7, numReviews: 876, featured: true },
    { name: 'La Mer Moisturizing Cream', description: 'Legendary moisturizer with Miracle Broth for ultimate skin transformation.', price: 380.00, originalPrice: 420.00, category: 'Beauty', brand: 'La Mer', images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', alt: 'La Mer Cream' }], stock: 25, ratings: 4.9, numReviews: 654, featured: true },
    { name: 'Charlotte Tilbury Pillow Talk Set', description: 'Bestselling nude-pink lip kit with matte revolution lipstick and lip liner.', price: 52.00, originalPrice: 64.00, category: 'Beauty', brand: 'Charlotte Tilbury', images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', alt: 'Pillow Talk Set' }], stock: 100, ratings: 4.8, numReviews: 1234, featured: false },
    { name: 'Olaplex Hair Repair Set', description: 'Complete bond-building treatment system for damaged and color-treated hair.', price: 84.00, originalPrice: 99.00, category: 'Beauty', brand: 'Olaplex', images: [{ url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800', alt: 'Olaplex Set' }], stock: 85, ratings: 4.7, numReviews: 987, featured: false },
    { name: 'SK-II Facial Treatment Essence', description: 'Iconic essence with over 90% Pitera for crystal-clear, radiant skin.', price: 235.00, originalPrice: 275.00, category: 'Beauty', brand: 'SK-II', images: [{ url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800', alt: 'SK-II Essence' }], stock: 40, ratings: 4.8, numReviews: 543, featured: true },

    // Toys
    { name: 'LEGO Star Wars Millennium Falcon', description: 'Ultimate Collector Series set with 7,541 pieces and incredible detail.', price: 849.99, originalPrice: 899.99, category: 'Toys', brand: 'LEGO', images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800', alt: 'LEGO Falcon' }], stock: 15, ratings: 4.9, numReviews: 432, featured: true },
    { name: 'PlayStation 5 Console', description: 'Next-gen gaming console with lightning-fast SSD and stunning 4K graphics.', price: 499.99, originalPrice: 549.99, category: 'Toys', brand: 'Sony', images: [{ url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800', alt: 'PS5 Console' }], stock: 20, ratings: 4.9, numReviews: 2156, featured: true },
    { name: 'Nintendo Switch OLED', description: 'Handheld gaming system with vibrant 7-inch OLED screen and enhanced audio.', price: 349.99, originalPrice: 379.99, category: 'Toys', brand: 'Nintendo', images: [{ url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800', alt: 'Nintendo Switch' }], stock: 55, ratings: 4.8, numReviews: 1876, featured: true },
    { name: 'Barbie DreamHouse', description: 'Three-story dollhouse with 8 rooms, working elevator, and pool slide.', price: 199.99, originalPrice: 229.99, category: 'Toys', brand: 'Mattel', images: [{ url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800', alt: 'Barbie DreamHouse' }], stock: 35, ratings: 4.6, numReviews: 654, featured: false },
    { name: 'Hot Wheels Ultimate Garage', description: 'Massive playset with space for 140+ cars, motorized gorilla, and racing tracks.', price: 149.99, originalPrice: 179.99, category: 'Toys', brand: 'Mattel', images: [{ url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800', alt: 'Hot Wheels Garage' }], stock: 40, ratings: 4.5, numReviews: 432, featured: false },

    // Automotive
    { name: 'Michelin Pilot Sport 4S Tires', description: 'Ultra-high performance summer tires with exceptional grip and handling.', price: 299.99, originalPrice: 349.99, category: 'Automotive', brand: 'Michelin', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Michelin Tires' }], stock: 100, ratings: 4.8, numReviews: 567, featured: true },
    { name: 'NOCO Boost Pro Jump Starter', description: '3000-amp portable lithium jump starter for gas and diesel engines.', price: 299.95, originalPrice: 349.95, category: 'Automotive', brand: 'NOCO', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'NOCO Jump Starter' }], stock: 75, ratings: 4.7, numReviews: 876, featured: false },
    { name: 'Thule Roof Cargo Box', description: 'Aerodynamic cargo carrier with 16 cubic feet of storage and dual-side opening.', price: 649.95, originalPrice: 749.95, category: 'Automotive', brand: 'Thule', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Thule Cargo Box' }], stock: 25, ratings: 4.9, numReviews: 234, featured: true },
    { name: 'WeatherTech Floor Liners', description: 'Custom-fit laser-measured floor mats for ultimate interior protection.', price: 199.95, originalPrice: 229.95, category: 'Automotive', brand: 'WeatherTech', images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'WeatherTech Liners' }], stock: 150, ratings: 4.6, numReviews: 1234, featured: false },
    { name: 'Meguiars Ultimate Detailing Kit', description: 'Complete car care kit with wash, wax, interior cleaner, and microfiber towels.', price: 89.99, originalPrice: 109.99, category: 'Automotive', brand: "Meguiar's", images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Meguiars Kit' }], stock: 200, ratings: 4.7, numReviews: 876, featured: false },

    // Health
    { name: 'Theragun Pro Massager', description: 'Professional-grade percussive therapy device with QuietForce technology.', price: 599.00, originalPrice: 649.00, category: 'Health', brand: 'Therabody', images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', alt: 'Theragun Pro' }], stock: 45, ratings: 4.8, numReviews: 654, featured: true },
    { name: 'Whoop 4.0 Fitness Band', description: 'Advanced health and fitness tracker with recovery, strain, and sleep coaching.', price: 239.00, originalPrice: 299.00, category: 'Health', brand: 'Whoop', images: [{ url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800', alt: 'Whoop Band' }], stock: 80, ratings: 4.6, numReviews: 543, featured: true },
    { name: 'Nutribullet Pro 900', description: 'High-powered personal blender for nutrient extraction and smoothie making.', price: 89.99, originalPrice: 109.99, category: 'Health', brand: 'Nutribullet', images: [{ url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800', alt: 'Nutribullet Pro' }], stock: 120, ratings: 4.5, numReviews: 2134, featured: false },
    { name: 'Philips Sonicare DiamondClean', description: 'Premium electric toothbrush with 5 modes and smart sensor technology.', price: 229.99, originalPrice: 279.99, category: 'Health', brand: 'Philips', images: [{ url: 'https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=800', alt: 'Sonicare Toothbrush' }], stock: 90, ratings: 4.7, numReviews: 987, featured: false },
    { name: 'Withings Body+ Smart Scale', description: 'Wi-Fi connected body composition scale with app tracking and multi-user support.', price: 99.95, originalPrice: 129.95, category: 'Health', brand: 'Withings', images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', alt: 'Withings Scale' }], stock: 65, ratings: 4.6, numReviews: 765, featured: false },

    // Other
    { name: 'Rimowa Original Cabin Luggage', description: 'Iconic aluminum suitcase with TSA-approved locks and multi-wheel system.', price: 1200.00, originalPrice: 1350.00, category: 'Other', brand: 'Rimowa', images: [{ url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800', alt: 'Rimowa Luggage' }], stock: 20, ratings: 4.9, numReviews: 321, featured: true },
    { name: 'Away Carry-On Suitcase', description: 'Lightweight hardside luggage with ejectable battery and compression system.', price: 295.00, originalPrice: 345.00, category: 'Other', brand: 'Away', images: [{ url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800', alt: 'Away Suitcase' }], stock: 55, ratings: 4.7, numReviews: 876, featured: false },
    { name: 'Montblanc Meisterstück Pen', description: 'Legendary writing instrument handcrafted with precious resin and gold trim.', price: 575.00, originalPrice: 650.00, category: 'Other', brand: 'Montblanc', images: [{ url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800', alt: 'Montblanc Pen' }], stock: 30, ratings: 4.9, numReviews: 234, featured: true },
    { name: 'Ray-Ban Aviator Sunglasses', description: 'Classic metal frame aviators with polarized crystal lenses and iconic design.', price: 168.00, originalPrice: 198.00, category: 'Other', brand: 'Ray-Ban', images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', alt: 'Ray-Ban Aviators' }], stock: 100, ratings: 4.6, numReviews: 1567, featured: false },
    { name: 'Apple AirPods Max', description: 'Over-ear headphones with active noise cancellation and spatial audio.', price: 549.00, originalPrice: 599.00, category: 'Other', brand: 'Apple', images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'AirPods Max' }], stock: 40, ratings: 4.7, numReviews: 987, featured: true }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Data cleared');

        // Create admin user first
        const createdUsers = await User.create(users);
        const adminUser = createdUsers[0]._id;
        console.log('Users seeded');

        // Add createdBy to products
        const productsWithAdmin = products.map(product => ({
            ...product,
            createdBy: adminUser
        }));

        await Product.create(productsWithAdmin);
        console.log('Products seeded');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Database cleared');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    clearDatabase();
} else {
    seedDatabase();
}
