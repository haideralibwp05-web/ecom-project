import type { ratingTypes,FAQItem } from "./../types/rating";
import filter from "../../assets/icons/filterImg.svg";
import arrowDown from "../../assets/icons/arrowDown.svg";
import stars from "../../assets/icons/StarsIcon.svg";
import threeDots from "../../assets/icons/threeDots.svg";
import verified from "../../assets/icons/VerifiedTick.svg";

export const ratingData: ratingTypes = {
    loadButton: "Load More Reviews",
    productHeader: [
        {
            id: 1,
            label: "Product Details",
            url: "/"
        },
        {
            id: 2,
            label: "Rating & Reviews",
            url: "/"
        },
        {
            id: 3,
            label: "FAQs",
            url: "/"
        }
    ],
    productFilter: {
        heading: "All Reviews",
        counting: 451,
        filterSrc: filter,
        latest: {
            label: "Latest",
            img: arrowDown,
        },
        reviewButton: "Write a Review"
    },
    reviewCards: [
        {
            id: 1,
            stars: stars,
            threeDots: threeDots,
            name: "Samantha D.",
            verified: verified,
            Desc: "I’m really happy with my purchase! The overall design looks great, and the quality feels impressive for the price. I especially like the attention to detail and the way everything comes together. It’s a great choice for anyone looking for something stylish, versatile, and worth the money.",
            
        },
        {
            id: 2,
            stars: stars,
            threeDots: threeDots,
            name: "Alex M.",
            verified: verified,
            Desc: "Honestly, I really like the overall look and finish of this product. It has a clean, stylish appearance that makes it easy to incorporate into my everyday routine. The quality is good, and the design feels thoughtfully made. Overall, it was a satisfying purchase, and I would consider exploring more products from this collection.",
            
        },
        {
            id: 3,
            stars: stars,
            threeDots: threeDots,
            name: "Ethan R.",
            verified: verified,
            Desc: "Great product with a nice balance of style, quality, and value. The finishing looks good, and the overall presentation gives it a premium feel. I appreciate products that combine a good appearance with everyday practicality, and this one does a nice job of that. Definitely a good option for anyone looking for something useful and stylish.",
            
        },
        {
            id: 4,
            stars: stars,
            threeDots: threeDots,
            name: "Olivia P.",
            verified: verified,
            Desc: "I really like the design and overall appearance of this product. It has a simple yet attractive style that works well with different preferences and occasions. The finishing is nice, and the quality is good for the price. Overall, I’m satisfied with my choice and think it’s a good addition to my collection.",

        },
        {
            id: 5,
            stars: stars,
            threeDots: threeDots,
            name: "Liam K.",
            verified: verified,
            Desc: "Very nice experience overall! The product looks great, and I appreciate the effort put into its design and finishing. It offers a good combination of appearance and practicality without feeling unnecessarily complicated. Considering the price and overall quality, I think it offers good value and would be a suitable choice for everyday use or gifting.",
            
        },
        {
            id: 6,
            stars: stars,
            threeDots: threeDots,
            name: "Ava H.",
            verified: verified,
            Desc: "I’m pleased with the overall quality and design of this product. The style is versatile, the finishing looks neat, and it has a modern appearance that makes it easy to appreciate. I always prefer products that offer a good mix of quality, style, and affordability, and this one fits that preference well. Overall, a lovely addition to my shopping experience.",
            
        },
    ],

}


export const faqsData: FAQItem[] = [
    {
        id: 1,
        question: "What are the key features and specifications of this product?",
        answer:
            "Every product has its own design, features, and specifications that make it suitable for different preferences and requirements. Before placing your order, we recommend reviewing the Product Details section carefully. It provides relevant information about the product's material, color, design, dimensions, available options, and other important characteristics. Understanding these specifications will help you make an informed decision and choose a product that best matches your expectations.",
    },
    {
        id: 2,
        question: "How can I choose the right size or product variation?",
        answer:
            "Choosing the right size or variation depends on the type of product you are purchasing. We recommend checking all available sizes, colors, styles, and other options displayed on the product page before adding an item to your cart. For products with size variations, review the provided measurements and sizing information carefully. If you are comparing multiple options, consider your personal preferences and intended use to select the most suitable variation.",
    },
    {
        id: 3,
        question: "Is this product suitable for everyday use and special occasions?",
        answer:
            "The suitability of a product depends on its design, functionality, material, and intended purpose. Many products can be used as part of your daily routine, while others may be more appropriate for formal events, celebrations, travel, or specific activities. Review the product description to understand its recommended uses and styling possibilities. Considering where and how you intend to use the product will help you determine whether it meets your everyday needs or special occasion requirements.",
    },
    {
        id: 4,
        question: "How should I care for and maintain this product?",
        answer:
            "Proper care and maintenance can help preserve the product's appearance, functionality, and overall condition over time. Always follow the care instructions provided in the product details, as cleaning and storage requirements may differ depending on the material and product type. Avoid using unsuitable cleaning products, exposing the item to conditions that may damage it, or storing it improperly. Regular, appropriate maintenance can help keep your purchase looking its best for longer.",
    },
    {
        id: 5,
        question: "How can I ensure that the product meets my expectations?",
        answer:
            "Before making a purchase, carefully review the product images, description, specifications, available variations, and displayed price. Pay particular attention to the material, dimensions, features, and other details relevant to your intended use. Comparing this information with your personal preferences can help you understand what to expect from the product. If additional information is provided on the product page, review it before completing your order to make a more confident purchasing decision.",
    },
    {
        id: 6,
        question: "What is the process for placing an order on your website?",
        answer:
            "Placing an order is designed to be straightforward and convenient. Start by selecting the product you want to purchase, choosing any available size, color, or other variations, and adding the item to your shopping cart. Review the items in your cart to confirm your selections and quantities. Continue to checkout, enter the required contact and delivery information, and review the order summary before submitting your order. Follow the instructions displayed on the website to complete the process.",
    },
    {
        id: 7,
        question: "How can I confirm that I have selected the correct product?",
        answer:
            "To confirm your selection, review the product name, images, description, selected variations, quantity, and displayed price before proceeding to checkout. Make sure the selected color, size, style, or other available options match your preferences. If your cart contains multiple products, check each item individually to avoid accidental selections. Taking a moment to verify your order details before submission can help reduce mistakes and ensure that the order reflects your intended purchase.",
    },
    {
        id: 8,
        question: "Will the product look exactly like it appears in the pictures?",
        answer:
            "Product images are provided to help you understand the item's design, color, finish, and overall appearance before purchasing. However, slight differences in color or visual details may occur due to screen settings, lighting conditions, photography, or differences between display devices. We recommend reviewing all available product images alongside the written description and specifications. These details provide a more complete understanding of the product and help you set realistic expectations before placing your order.",
    },
    {
        id: 9,
        question: "What should I do if I need more information before purchasing?",
        answer:
            "If you need additional information before placing an order, begin by reviewing the product description, specifications, available options, and any other information provided on the product page. If your question remains unanswered, contact the store's customer support team through the available contact channels. When requesting assistance, mention the product name and the specific information you need. This will help the support team understand your query and provide more relevant guidance so you can make an informed decision.",
    },
    {
        id: 10,
        question: "What should I review before completing the checkout process?",
        answer:
            "Before completing checkout, carefully verify the products in your cart, selected sizes or variations, quantities, individual prices, and total order amount. Ensure that your contact details and delivery address are accurate and complete. Review the available payment methods, delivery information, and any applicable store policies displayed during checkout. Once you have confirmed that all information is correct, follow the final instructions to submit your order. Keeping these details accurate helps support a smoother ordering and delivery experience.",
    },
];
