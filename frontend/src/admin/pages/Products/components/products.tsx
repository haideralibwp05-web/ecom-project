import { productsData as data } from "../../../data/products";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../../../services/productApi";
import "../../../../style.css";
import { Link, useNavigate } from "react-router-dom";
import ConfirmPopup from "../../../components/shared/ConfirmPopup";
import * as XLSX from "xlsx-js-style";

const Products = () => {
    const navigate = useNavigate();

    // products
    const [products, setProducts] = useState<any[]>([]);

    // total products
    const totalProducts = products.length;

    // search functionality
    const [search, setSearch] = useState("");

    // filter menu
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // category filter
    const [selectedCategory, setSelectedCategory] = useState("");

    // availability filter
    const [selectedAvailability, setSelectedAvailability] = useState("");

    // color filter
    const [selectedColor, setSelectedColor] = useState("");

    // size filter
    const [selectedSize, setSelectedSize] = useState("");
    // pagination
    const PRODUCTS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);
    // filtered products
    const filteredProducts = products.filter((product) => {

        // search
        const matchesSearch = product.name
            ?.toLowerCase()
            .includes(search.trim().toLowerCase());

        // category
        const matchesCategory =
            selectedCategory === "" ||
            product.category_name === selectedCategory;

        // availability
        const matchesAvailability =
            selectedAvailability === "" ||
            (
                selectedAvailability === "in_stock" &&
                Number(product.stock) > 0
            ) ||
            (
                selectedAvailability === "out_of_stock" &&
                Number(product.stock) === 0
            );

        // color
        const matchesColor =
            selectedColor === "" ||
            product.color_name === selectedColor;

        // size
        const matchesSize =
            selectedSize === "" ||
            product.sizes?.includes(selectedSize);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesAvailability &&
            matchesColor &&
            matchesSize
        );
    });

    // total filtered products
    const totalFilterProducts = filteredProducts.length;

    // sorting
    const [
        sortField,
        setSortField
    ] = useState<"discount_price" | "stock" | null>(null);

    const [
        sortOrder,
        setSortOrder
    ] = useState<"asc" | "desc" | null>(null);

    // sorted products
    const sortedProducts = [...filteredProducts].sort((a, b) => {

        // no sorting
        if (!sortField || !sortOrder) {
            return 0;
        }

        const valueA = Number(a[sortField]) || 0;
        const valueB = Number(b[sortField]) || 0;

        return sortOrder === "asc"
            ? valueA - valueB
            : valueB - valueA;
    });

    // pagination
    const totalPages = Math.ceil(
        sortedProducts.length / PRODUCTS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * PRODUCTS_PER_PAGE;

    const paginatedProducts = sortedProducts.slice(
        startIndex,
        startIndex + PRODUCTS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        selectedCategory,
        selectedAvailability,
        selectedColor,
        selectedSize,
        sortField,
        sortOrder,
    ]);

    // selected products
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    // delete popup
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deletePopupMessage, setDeletePopupMessage] = useState("");
    const [isDeleteWarning, setIsDeleteWarning] = useState(false);

    // edit popup
    const [isEditWarning, setIsEditWarning] = useState(false);
    const [editPopupMessage, setEditPopupMessage] = useState("");
    const [showEditPopup, setShowEditPopup] = useState(false);
    // loading
    const [loading, setLoading] = useState(true);

    // get products
    useEffect(() => {

        const loadProducts = async () => {

            try {

                const result = await getProducts();

                setProducts(result);

            } catch (error) {

                console.error(
                    "Products fetch error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadProducts();

    }, []);

    // delete products
    const handleDeleteProducts = async () => {

        if (selectedProducts.length === 0) {
            return;
        }

        try {

            await Promise.all(
                selectedProducts.map((productId) =>
                    deleteProduct(productId)
                )
            );

            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) =>
                        !selectedProducts.includes(product.id)
                )
            );

            setSelectedProducts([]);

            setShowDeletePopup(false);

        } catch (error) {

            console.error(
                "Products delete error:",
                error
            );

        }
    };

    // edit product
    const handleEditProduct = () => {

        if (selectedProducts.length !== 1) {
            return;
        }

        const product = products.find(
            (item) =>
                item.id === selectedProducts[0]
        );

        if (!product) {
            return;
        }

        setShowEditPopup(false);

        navigate(
            `/admin/products/edit/${product.id}`,
            {
                state: {
                    product,
                },
            }
        );
    };

    const exportProducts = () => {
        const selectedItems = filteredProducts.filter((product) =>
            selectedProducts.includes(product.id)
        );

        // Koi selected product nahi to export nahi hoga
        if (selectedItems.length === 0) return;

        const headers = [
            "Product ID",
            "Product Name",
            "Category",
            "Stock",
            "Color",
            "Sizes",
            "Original Price (PKR)",
            "Discount Price (PKR)",
            "Final Price (PKR)",
        ];

        const rows = selectedItems.map((product) => {
            const price = Number(product.price) || 0;
            const discountPrice =
                product.discount_price !== null &&
                    product.discount_price !== "" &&
                    Number(product.discount_price) > 0 &&
                    Number(product.discount_price) < price
                    ? Number(product.discount_price)
                    : null;

            return [
                product.id,
                product.name ?? "",
                product.category_name ?? "",
                Number(product.stock) || 0,
                product.color_name ?? "",
                Array.isArray(product.sizes)
                    ? product.sizes.join(", ")
                    : "",
                price,
                discountPrice ?? "",
                discountPrice ?? price,
            ];
        });

        const worksheet = XLSX.utils.aoa_to_sheet([
            headers,
            ...rows,
        ]);

        // Column widths
        worksheet["!cols"] = [
            { wch: 12 }, // Product ID
            { wch: 28 }, // Product Name
            { wch: 22 }, // Category
            { wch: 12 }, // Stock
            { wch: 18 }, // Color
            { wch: 20 }, // Sizes
            { wch: 23 }, // Original Price
            { wch: 23 }, // Discount Price
            { wch: 20 }, // Final Price
        ];

        // Style headings
        for (let col = 0; col < headers.length; col++) {
            const address = XLSX.utils.encode_cell({
                r: 0,
                c: col,
            });

            worksheet[address].s = {
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: "202B5B" },
                },
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" },
                    sz: 11,
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true,
                },
                border: {
                    top: { style: "thin", color: { rgb: "B8C0D8" } },
                    bottom: { style: "thin", color: { rgb: "B8C0D8" } },
                    left: { style: "thin", color: { rgb: "B8C0D8" } },
                    right: { style: "thin", color: { rgb: "B8C0D8" } },
                },
            };
        }


        // Style data cells and prices
        for (let row = 1; row <= rows.length; row++) {
            for (let col = 0; col < headers.length; col++) {
                const address = XLSX.utils.encode_cell({
                    r: row,
                    c: col,
                });

                const cell = worksheet[address];
                if (!cell) continue;

                cell.s = {
                    font: { sz: 10 },
                    alignment: {
                        vertical: "center",
                        horizontal: "left",
                    },
                    border: {
                        top: { style: "thin", color: { rgb: "D9DFEA" } },
                        bottom: { style: "thin", color: { rgb: "D9DFEA" } },
                        left: { style: "thin", color: { rgb: "D9DFEA" } },
                        right: { style: "thin", color: { rgb: "D9DFEA" } },
                    },
                };

                if (col === 6 || col === 7 || col === 8) {
                    if (typeof cell.v === "number") {
                        cell.z = '"Rs. "#,##0.00';
                    }
                }
            }
        }

        worksheet["!rows"] = [
            { hpt: 32 },
            ...rows.map(() => ({ hpt: 23 })),
        ];

        // Excel filters
        worksheet["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: rows.length, c: headers.length - 1 },
            }),
        };

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Products"
        );

        XLSX.writeFile(workbook, "Shop.CO-products.xlsx");
    };

    // clear filters
    const handleClearFilters = () => {

        setSelectedCategory("");
        setSelectedAvailability("");
        setSelectedColor("");
        setSelectedSize("");
    };

    return (
        <main className="adminPages">

            {/* ================= HEADER ================= */}

            <div className="adminPagesHeader">

                <h2>
                    {data.title}
                </h2>

                <div className="adminPagesHeader_buttons">

                    <button
                        type="button"
                        className="adminPagesHeader_button1"
                        onClick={exportProducts}
                        disabled={
                            !filteredProducts.some((product) =>
                                selectedProducts.includes(product.id)
                            )
                        }
                    >
                        {data.actions.export}
                    </button>

                    <Link
                        to="/admin/products/add"
                        className="adminPagesHeader_button2"
                    >
                        + {data.actions.addProduct}
                    </Link>

                </div>

            </div>


            {/* ================= PRODUCTS BOX ================= */}

            <div className="adminPagesBox">

                {/* ================= TOOLS ================= */}

                <div className="adminPagesBox_Tools">

                    <div className="adminPagesBox_Tools_left">

                        {/* Filter button */}

                        <button
                            type="button"
                            className="adminPagesBox_Filter"
                            onClick={() =>
                                setShowFilterMenu(
                                    (prev) => !prev
                                )
                            }
                        >
                            {data.filters.filter}

                            <img
                                src={data.filters.filter_icon}
                                alt=""
                            />
                        </button>


                        {/* Search */}

                        <div className="adminPagesBox_Search">

                            <img
                                src={data.filters.serach_icon}
                                alt=""
                            />

                            <input
                                type="text"
                                placeholder={data.filters.search}
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {/* Right actions */}

                    <div className="adminPagesBox_Tools_Right">

                        {/* Edit */}

                        <button
                            onClick={() => {
                                if (selectedProducts.length === 0) {
                                    setEditPopupMessage(
                                        "Please select one product to edit."
                                    );
                                    setIsEditWarning(true);
                                    setShowEditPopup(true);
                                    return;
                                }

                                if (selectedProducts.length > 1) {
                                    setEditPopupMessage(
                                        "Please select only one product."
                                    );
                                    setIsEditWarning(true);
                                    setShowEditPopup(true);
                                    return;
                                }

                                setEditPopupMessage(
                                    "Are you sure you want to edit this product?"
                                );
                                setIsEditWarning(false);
                                setShowEditPopup(true);
                            }}
                        >
                            <img src={data.tableActions.edit} alt="Edit" />
                        </button>






                        {/* Delete */}

                        <button
                            onClick={() => {
                                if (selectedProducts.length === 0) {
                                    setDeletePopupMessage(
                                        "Please select at least one product."
                                    );

                                    setIsDeleteWarning(true);
                                    setShowDeletePopup(true);
                                    return;
                                }

                                setIsDeleteWarning(false);
                                setShowDeletePopup(true);
                            }}
                        >
                            <img
                                src={data.tableActions.delete}
                                alt="Delete"
                            />
                        </button>

                    </div>

                </div>


                {/* ================= FILTER MENU ================= */}

                {showFilterMenu && (

                    <div className="adminProducts_FilterMenu">

                        {/* Category */}

                        <div className="adminProducts_FilterItem">

                            <label>
                                Category
                            </label>

                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>

                                {[
                                    ...new Set(
                                        products
                                            .map(
                                                (product) =>
                                                    product.category_name
                                            )
                                            .filter(Boolean)
                                    ),
                                ].map((category) => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Availability */}

                        <div className="adminProducts_FilterItem">

                            <label>
                                Availability
                            </label>

                            <select
                                value={selectedAvailability}
                                onChange={(e) =>
                                    setSelectedAvailability(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="in_stock">
                                    In Stock
                                </option>

                                <option value="out_of_stock">
                                    Out of Stock
                                </option>

                            </select>

                        </div>


                        {/* Color */}

                        <div className="adminProducts_FilterItem">

                            <label>
                                Color
                            </label>

                            <select
                                value={selectedColor}
                                onChange={(e) =>
                                    setSelectedColor(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Colors
                                </option>

                                {[
                                    ...new Set(
                                        products
                                            .map(
                                                (product) =>
                                                    product.color_name
                                            )
                                            .filter(Boolean)
                                    ),
                                ].map((color) => (

                                    <option
                                        key={color}
                                        value={color}
                                    >
                                        {color}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Size */}

                        <div className="adminProducts_FilterItem">

                            <label>
                                Size
                            </label>

                            <select
                                value={selectedSize}
                                onChange={(e) =>
                                    setSelectedSize(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Sizes
                                </option>

                                {[
                                    "XS",
                                    "S",
                                    "M",
                                    "L",
                                    "XL",
                                    "XXL",
                                ].map((size) => (

                                    <option
                                        key={size}
                                        value={size}
                                    >
                                        {size}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Clear filters */}

                        <button
                            type="button"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                )}


                {/* ================= TABLE ================= */}

                <table className="adminPagesBox_Table">

                    <thead>

                        <tr>

                            {/* Select all */}

                            <th>

                                <input
                                    type="checkbox"
                                    checked={
                                        paginatedProducts.length > 0 &&
                                        paginatedProducts.every(
                                            (product) =>
                                                selectedProducts.includes(
                                                    product.id
                                                )
                                        )
                                    }
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            setSelectedProducts(
                                                (prev) => [
                                                    ...prev,
                                                    ...paginatedProducts
                                                        .map(
                                                            (product) =>
                                                                product.id
                                                        )
                                                        .filter(
                                                            (id) =>
                                                                !prev.includes(id)
                                                        ),
                                                ]
                                            );

                                        } else {

                                            setSelectedProducts(
                                                (prev) =>
                                                    prev.filter(
                                                        (id) =>
                                                            !paginatedProducts.some(
                                                                (product) =>
                                                                    product.id === id
                                                            )
                                                    )
                                            );

                                        }

                                    }}
                                />

                            </th>


                            {/* Product */}

                            <th>
                                Product
                            </th>


                            {/* Stock sorting */}

                            <th>

                                <button
                                    type="button"
                                    onClick={() => {

                                        if (
                                            sortField !== "stock"
                                        ) {

                                            // First click
                                            // ascending

                                            setSortField(
                                                "stock"
                                            );

                                            setSortOrder(
                                                "asc"
                                            );

                                        } else if (
                                            sortOrder === "asc"
                                        ) {

                                            // Second click
                                            // descending

                                            setSortOrder(
                                                "desc"
                                            );

                                        } else if (
                                            sortOrder === "desc"
                                        ) {

                                            // Third click
                                            // reset

                                            setSortField(
                                                null
                                            );

                                            setSortOrder(
                                                null
                                            );

                                        } else {

                                            setSortOrder(
                                                "asc"
                                            );

                                        }

                                    }}
                                >

                                    Stock

                                    {sortField === "stock" &&
                                        sortOrder === "asc"
                                        ? " ↑"
                                        : sortField === "stock" &&
                                            sortOrder === "desc"
                                            ? " ↓"
                                            : " ↕"}

                                </button>

                            </th>


                            {/* Color */}

                            <th>
                                Color
                            </th>


                            {/* Price sorting */}

                            <th>

                                <button
                                    type="button"
                                    onClick={() => {

                                        if (
                                            sortField !==
                                            "discount_price"
                                        ) {

                                            // First click
                                            // ascending

                                            setSortField(
                                                "discount_price"
                                            );

                                            setSortOrder(
                                                "asc"
                                            );

                                        } else if (
                                            sortOrder === "asc"
                                        ) {

                                            // Second click
                                            // descending

                                            setSortOrder(
                                                "desc"
                                            );

                                        } else if (
                                            sortOrder === "desc"
                                        ) {

                                            // Third click
                                            // reset

                                            setSortField(
                                                null
                                            );

                                            setSortOrder(
                                                null
                                            );

                                        } else {

                                            setSortOrder(
                                                "asc"
                                            );

                                        }

                                    }}
                                >

                                    Price

                                    {sortField ===
                                        "discount_price" &&
                                        sortOrder === "asc"
                                        ? " ↑"
                                        : sortField ===
                                            "discount_price" &&
                                            sortOrder === "desc"
                                            ? " ↓"
                                            : " ↕"}

                                </button>

                            </th>


                            {/* Size */}

                            <th>
                                Size
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {/* No products */}

                        {filteredProducts.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={
                                        data.columns.length + 1
                                    }
                                    className="adminProducts_NoProducts"
                                >
                                    No products are available
                                </td>

                            </tr>

                        ) : (

                            /* Products */

                            paginatedProducts.map((item) => (

                                <tr
                                    key={item.id}
                                    className="adminPages_TableData"
                                >

                                    {/* Checkbox */}

                                    <td>

                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(
                                                item.id
                                            )}
                                            onChange={() => {

                                                setSelectedProducts(
                                                    (prev) =>
                                                        prev.includes(
                                                            item.id
                                                        )
                                                            ? prev.filter(
                                                                (id) =>
                                                                    id !==
                                                                    item.id
                                                            )
                                                            : [
                                                                ...prev,
                                                                item.id,
                                                            ]
                                                );

                                            }}
                                        />

                                    </td>


                                    {/* Product */}

                                    <td>

                                        <div className="adminProducts_Product">

                                            {item.images?.length >
                                                0 && (

                                                    <img
                                                        src={`http://127.0.0.1:8000${item.images[0].image}`}
                                                        alt={item.name}
                                                    />

                                                )}

                                            <div>

                                                <span>
                                                    {item.name}
                                                </span>

                                                <small>
                                                    {
                                                        item.category_name
                                                    }
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    {/* Stock */}

                                    <td>

                                        {Number(item.stock) === 0 ? (

                                            <span className="adminProducts_OutOfStock">
                                                Out of Stock
                                            </span>

                                        ) : (

                                            item.stock

                                        )}

                                    </td>


                                    {/* Color */}

                                    <td>
                                        {item.color_name}
                                    </td>


                                    {/* Price */}


                                    {/* Price */}
                                    <td>
                                        {(
                                            item.discount_price !== null &&
                                                item.discount_price !== "" &&
                                                Number(item.discount_price) > 0 &&
                                                Number(item.discount_price) < Number(item.price)
                                                ? Number(item.discount_price)
                                                : Number(item.price)
                                        ).toLocaleString()} /-Rs
                                    </td>


                                    {/* Size */}

                                    <td>
                                        {item.sizes?.join(", ")}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>


                {/* ================= FOOTER ================= */}

                <div className="adminPages_Footer">

                    <div className="adminPages_FooterPagination">

                        {/* Previous */}

                        <button
                            className="adminPages_PaginationBack"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    (prev) => prev - 1
                                )
                            }
                        >

                            <img
                                src={data.pagination.previousIcon}
                                alt=""
                            />

                        </button>


                        {/* Page Numbers */}

                        {Array.from(
                            {
                                length: totalPages,
                            },
                            (_, index) => index + 1
                        ).map((page) => (

                            <button
                                key={page}
                                className={
                                    currentPage === page
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setCurrentPage(page)
                                }
                            >
                                {page}
                            </button>

                        ))}


                        {/* Next */}

                        <button
                            className="adminPages_PaginationForward"
                            disabled={
                                currentPage === totalPages ||
                                totalPages === 0
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (prev) => prev + 1
                                )
                            }
                        >

                            <img
                                src={data.pagination.nextIcon}
                                alt=""
                            />

                        </button>

                    </div>


                    <span>
                        {totalFilterProducts} Results
                    </span>

                </div>
            </div>


            {/* ================= DELETE POPUP ================= */}

            <ConfirmPopup
                open={showDeletePopup}
                message={
                    isDeleteWarning
                        ? deletePopupMessage
                        : selectedProducts.length === 1
                            ? "Are you sure you want to delete this product?"
                            : `Are you sure you want to delete these ${selectedProducts.length} products?`
                }
                cancelText={isDeleteWarning ? "Close" : "Cancel"}
                confirmText={isDeleteWarning ? "" : "Delete"}
                onCancel={() => {
                    setShowDeletePopup(false);
                }}
                onConfirm={() => {
                    if (isDeleteWarning) {
                        setShowDeletePopup(false);
                        return;
                    }

                    handleDeleteProducts();
                }}
            />


            {/* ================= EDIT POPUP ================= */}
            <ConfirmPopup
                open={showEditPopup}
                message={editPopupMessage}
                cancelText={isEditWarning ? "Close" : "Cancel"}
                confirmText={isEditWarning ? "" : "Edit"}
                onCancel={() => {
                    setShowEditPopup(false);
                }}
                onConfirm={() => {
                    if (isEditWarning) {
                        setShowEditPopup(false);
                        return;
                    }

                    handleEditProduct();
                }}
            />

        </main >
    );
};

export default Products;