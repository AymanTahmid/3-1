import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dum1l0rci/image/upload';
  const uploadPreset = 'mern-estate';

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(null);

      const promises = Array.from(files).map((file) => uploadToCloudinary(file));

      try {
        const urls = await Promise.all(promises);
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError(null);
        setUploading(false);
      } catch (err) {
        setImageUploadError('Image upload failed (2 MB max per image)');
        setUploading(false);
      }
    } else {
      setImageUploadError('You can upload up to 6 images per listing');
    }
  };

  const uploadToCloudinary = async (file) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(cloudinaryUploadUrl, uploadData);
      return response.data.secure_url;
    } catch (error) {
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [id]: parseInt(value) });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError('At least one image is required.');
      return;
    }
    if (formData.regularPrice < formData.discountPrice) {
      setError('Discount price must be lower than regular price.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        navigate(`/listing/${data._id}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create listing. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-7">Create a Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="p-2 border border-gray-300 rounded"
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="p-2 border border-gray-300 rounded"
          />

          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="p-2 border border-gray-300 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bedrooms">Bedrooms:</label>
              <input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="bathrooms">Bathrooms:</label>
              <input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <label htmlFor="regularPrice">Regular Price ($/month):</label>
          <input
            id="regularPrice"
            type="number"
            value={formData.regularPrice}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />

          {formData.offer && (
            <div>
              <label htmlFor="discountPrice">Discount Price ($/month):</label>
              <input
                id="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="offer"
              type="checkbox"
              checked={formData.offer}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="offer">Offer</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="parking"
              type="checkbox"
              checked={formData.parking}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="parking">Parking</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="furnished"
              type="checkbox"
              checked={formData.furnished}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="furnished">Furnished</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="type"
              type="checkbox"
              checked={formData.type === 'sale'}
              onChange={() => setFormData({ ...formData, type: formData.type === 'sale' ? 'rent' : 'sale' })}
              className="w-4 h-4"
            />
            <label htmlFor="type">Sale</label>
          </div>

          <label htmlFor="images">Images (max 6):</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              <img src={url} alt={`Uploaded ${index}`} className="w-20 h-20 object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            type="submit"
            className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Create Listing'}
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
