import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import React, { useState, useEffect } from 'react';
import { api } from "../Instant/BaseUrl"

export default function Product() {
  // const catageries = ['Electronics', 'Furniture', 'Accessories', 'Fashion', 'Home Decor', 'Pharma', 'Health & Beauty', 'Sports', 'Toys', 'Books'];
  const units = ['kg', 'g', 'ltr', 'pcs', 'dozen', 'set', 'box', 'pack'];
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // localStorage se data load karo initial state ke liye
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  const [categ_Data, setCatageries] = useState([]);

  console.log("data categoreis", categ_Data)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '',
    stockQuantity: '',
    unitIndex: '',
    unitName: '',
    catageryIndex: '',
    catageryName: '',
  });

  // Jab products update ho to localStorage me save karo
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'catageryId') {
      const selected = categ_Data.find(c => c._id === value);
      setFormData({
        ...formData,
        catageryId: value,
        catageryName: selected?.name || ''
      });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.unitName) {
      alert("Please select a unit before submitting.");
      return;
    }


    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      unit: formData.unitName,
      categoryId: parseInt(formData.catageryIndex), //  match backend
    };

    console.log("Payload to be sent:", payload);

    try {
      const response = await api.post('admin/products/add-product', payload, {
        withCredentials: true, // backend ko token yahan se milega cookie me se
      });

      const res_data = response.data;
      console.log("response from server", res_data);
    } catch (error) {
      console.error("Error in Product component:", error);
    }


    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = formData;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([...products, formData]);
    }
    setFormData({
      name: '',
      price: '',
      costPrice: '',
      stockQuantity: '',
      unit: '',
      catageryIndex: '',
      catageryName: '',
    });
    setIsOpen(false);
  };

  const handleDelete = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleEdit = (index) => {
    setFormData(products[index]);
    setEditIndex(index);
    setIsOpen(true);
  };



  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = formData; // id se product identify hoga
      const response = await api.put(`admin/products/update-product/${id}`, updateData, {
        withCredentials: true,
      });

      // Update local state
      const updated = [...products];
      updated[editIndex] = response.data.updatedProduct || updateData;
      setProducts(updated);

      // Reset state
      setFormData({
        id: '',
        name: '',
        price: '',
        costPrice: '',
        stockQuantity: '',
        unitIndex: '',
        unitName: '',
        catageryIndex: '',
        catageryName: '',
      });
      setEditIndex(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };


  // Fetch categories on mount
  useEffect(() => {
    api.get('admin/categories/', { withCredentials: true })
      .then((response) => {
        setCatageries(response.data.categories || []); // set categories or empty array
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);



  return (
    <div className="bg-gray-50 min-h-screen border-black flex flex-col items-center">
      <h1 className="text-3xl !font-bold mb-6 flex items-center">Products</h1>

      {/* add product form code start */}


      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-[#155dfc] !text-white hover:bg-blue-700" onClick={() => {
            setIsOpen(true);
            setEditIndex(null);
            setFormData({
              name: '',
              price: '',
              costPrice: '',
              stockQuantity: '',
              unit: '',
              catageryIndex: '',
              catageryName: '',
            });
          }}> Add New Product</Button>
        </SheetTrigger>

        {isOpen && (
          <SheetContent>
            <SheetHeader>

              <SheetTitle>{editIndex !== null ? 'Edit' : 'Add'} Product Form</SheetTitle>
              <SheetDescription>
                please fill out the form below to add a new product.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid flex-1 auto-rows-min gap-5 px-6 mt-[-20px]" >
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-name">PRODUCT NAME</Label>
                  <Input placeholder="Enter product name" name="name"
                    value={(formData.name).toLowerCase()}
                    onChange={handleChange}
                    required />

                  <Label htmlFor="sheet-demo-username">PRICE</Label>
                  <Input placeholder="Enter price"
                    name="price"
                    value={(formData.price)}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-username">COSTPRISE</Label>
                  <Input placeholder="CostPrice"
                    name="costPrice"
                    value={(formData.costPrice)}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-username">STOCK QYANTITY</Label>
                  <Input placeholder="Stockquantity"
                    name="stockQuantity"
                    value={(formData.stockQuantity)}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </div>
                {/* select unit ccode start */}
                <Select
                  value={formData.unitIndex?.toString()}
                  onValueChange={(value) => {
                    const index = parseInt(value);
                    setFormData({
                      ...formData,
                      unitIndex: index,
                      unitName: units[index],
                    });
                  }}
                >
                  <SelectTrigger className="w-[340px] ">
                    <SelectValue placeholder="Select Unit">{formData.unitName || "Select Unit"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Unit</SelectLabel>
                      {/* <SelectItem value="" disabled>Acceceries</SelectItem> */}
                      {units.map((uni, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {uni}

                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* select unit code end */}






                {/* select catagary in form code start */}
                <Select
                  value={formData.catageryIndex?.toString()}
                  onValueChange={(value) => {
                    const index = parseInt(value);
                    const selected = categ_Data[index];
                    setFormData({
                      ...formData,
                      catageryIndex: index,
                      catageryName: selected?.name || '',
                      catageryId: selected?._id || '',
                    });
                  }}
                >
                  <SelectTrigger className="w-[340px]">
                    <SelectValue placeholder="Select a category">
                      {formData.catageryName || "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Category</SelectLabel>
                      {categ_Data.length > 0 ? (
                        categ_Data.map((data, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {data?.name || "No Category Found"}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-catagory" disabled>
                          No Categories Found
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* select catagary in form code end */}

                <SheetFooter>
                  <Button type="submit" className="bg-[#155dfc] font-bold !text-white" > {editIndex !== null ? 'Update' : 'Save'}</Button>
                  <SheetClose asChild>
                    <Button className="bg-[#155dfc] font-bold !text-white"
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setEditIndex(null);
                      }}
                    >Cencel</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </form>
          </SheetContent>
        )}
      </Sheet>
      {/* add product form code end */}

      {/* Table */}
      <div className="mt-8 overflow-x-auto border-black">
        {products.length === 0 ? (
          <p className="text-gray-600 text-center">No products added yet.</p>
        ) : (
          <table className="min-w-full text-left border-collapse border border-gray-300 rounded-lg shadow-lg bg-white">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-6 py-3 border border-gray-300">#</th>
                <th className="px-6 py-3 border border-gray-300">Name</th>
                <th className="px-6 py-3 border border-gray-300">Catagery</th>
                <th className="px-6 py-3 border border-gray-300">Price</th>
                <th className="px-6 py-3 border border-gray-300">Cost</th>
                <th className="px-6 py-3 border border-gray-300">Stock</th>
                <th className="px-6 py-3 border border-gray-300">Unit</th>
                <th className="px-6 py-3 border border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="px-6 py-3 border border-gray-300">{index + 1}</td>
                  <td className="px-6 py-3 border border-gray-300">{p.name}</td>
                  <td className="px-6 py-3 border border-gray-300">{p.catageryName}</td>
                  <td className="px-6 py-3 border border-gray-300">Rs. {p.price}</td>
                  <td className="px-6 py-3 border border-gray-300">Rs. {p.costPrice}</td>
                  <td className="px-6 py-3 border border-gray-300">{p.stockQuantity}</td>
                  <td className="px-6 py-3 border border-gray-300">{p.unitName}</td>
                  <td className="px-6 py-3 border border-gray-300 text-center gap-1 flex justify-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="inline-block px-4 py-1 rounded-2xl bg-[#155dfc] !text-white font-semibold  transition "
                      aria-label={`Edit product ${p.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="inline-block px-4 py-1 rounded-2xl bg-[#155dfc] !text-white font-semibold transition "
                      aria-label={`Delete product ${p.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}