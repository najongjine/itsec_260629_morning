import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from './auth';
import { useNavigate, useSearchParams } from 'react-router';
import { apiUrl } from './api';
import './ProductUpsert.css';

interface Category {
  id: number;
  name: string;
}

interface PreviewImage {
  name: string;
  url: string;
  file?: File;
}

function ProductUpsert() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id') || '0';
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<PreviewImage[]>([]);

  const isEdit = productId !== '0';

  useEffect(() => {
    getCategories();
    if (isEdit) getProduct();
  }, [productId]);

  async function getCategories() {
    const response = await fetch(apiUrl('/categorylist'));
    const result = await response.json();
    if (result.success) setCategories(result.data || []);
  }

  async function getProduct() {
    const response = await fetch(
      apiUrl(`/get_a_product?id=${productId}`),
    );
    const result = await response.json();
    const product = result.data;

    if (!result.success || !product) return;

    setName(product.name || '');
    setDescription(product.content || '');
    setPrice(String(product.price || 0));
    setCategoryId(String(product.category_id || ''));
    setImages(
      (product.images || []).map((image: { filepath: string }) => ({
        name: image.filepath.split('/').pop() || '기존 이미지',
        url: image.filepath,
      })),
    );
  }

  function addImages(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    const availableCount = 5 - images.length;
    const files = selectedFiles.slice(0, availableCount);

    if (selectedFiles.length > availableCount) {
      alert('이미지는 최대 5개까지 등록할 수 있습니다.');
    }

    const newImages = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...newImages]);
    event.target.value = '';
  }

  function removeImage(index: number) {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);
    setImages(nextImages);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      alert('상품명을 입력해 주세요.');
      return;
    }
    if (!categoryId) {
      alert('카테고리를 선택해 주세요.');
      return;
    }
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('content', description);
    formData.append('price', price || '0');
    formData.append('category_id', categoryId);
    formData.append('product_id', productId);

    images.forEach((image) => {
      if (image.file) formData.append('images', image.file);
    });

    const response = await fetch(apiUrl('/upsert_product'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();

    if (!result.success) {
      alert(`상품 저장 실패: ${result.msg || ''}`);
      return;
    }

    alert(isEdit ? '상품을 수정했습니다.' : '상품을 등록했습니다.');
    navigate('/');
  }

  return (
    <main className="product-form-page">
      <form className="product-form" onSubmit={saveProduct}>
        <header className="product-form__header">
          <p className="product-form__eyebrow">PRODUCT</p>
          <h1>{isEdit ? '상품 수정' : '상품 등록'}</h1>
          <p>상품 정보를 입력하고 이미지를 등록해 주세요.</p>
        </header>

        <div className="product-form__fields">
          <label className="product-field">
            <span>상품명</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="상품명을 입력하세요"
            />
          </label>

          <label className="product-field">
            <span>가격</span>
            <div className="product-field__price">
              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0"
              />
              <em>원</em>
            </div>
          </label>

          <label className="product-field">
            <span>카테고리</span>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="product-field">
            <span>상품 설명</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="상품 설명을 입력하세요"
              rows={5}
            />
          </label>
        </div>

        <section className="image-field">
          <div className="image-field__heading">
            <div>
              <h2>상품 이미지</h2>
              <p>최대 5개까지 등록할 수 있습니다.</p>
            </div>
            <span>{images.length} / 5</span>
          </div>

          <div className="image-preview-list">
            {images.map((image, index) => (
              <div className="image-preview" key={`${image.name}-${index}`}>
                <img src={image.url} alt={`${index + 1}번 상품 이미지`} />
                <button
                  type="button"
                  className="image-preview__remove"
                  onClick={() => removeImage(index)}
                  aria-label={`${index + 1}번 이미지 삭제`}
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="image-add">
                <input type="file" accept="image/*" multiple onChange={addImages} />
                <span>＋</span>
                <strong>이미지 추가</strong>
              </label>
            )}
          </div>
        </section>

        <div className="product-form__buttons">
          <button type="button" className="button button--cancel" onClick={() => navigate(-1)}>
            취소
          </button>
          <button type="submit" className="button button--submit">
            {isEdit ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default ProductUpsert;
