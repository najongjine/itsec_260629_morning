import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import { useNavigate, useSearchParams } from 'react-router';
import './Detail.css';

interface ProductImage {
  id: number;
  filepath: string;
}

interface Product {
  product_id: number;
  user_id: number;
  name: string;
  content: string;
  price: number;
  category_name: string;
  username: string;
  created_dt: string;
  images: ProductImage[];
}

function Detail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '0';
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    getProduct();
  }, [id]);

  async function getProduct() {
    const response = await fetch(`http://localhost:8000/get_a_product?id=${id}`);
    const result = await response.json();
    if (result.success) setProduct(result.data);
  }

  async function deleteProduct() {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!confirm('상품을 삭제하시겠습니까?')) return;

    const response = await fetch(`http://localhost:8000/delete_product?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();

    if (!result.success) {
      alert(`삭제 실패: ${result.msg || ''}`);
      return;
    }

    alert('상품을 삭제했습니다.');
    navigate('/');
  }

  if (!product) {
    return <main className="detail-page"><p className="detail-empty">상품을 불러오는 중입니다.</p></main>;
  }

  const canEdit = user?.id === product.user_id;

  return (
    <main className="detail-page">
      <article className="detail-card">
        <div className="detail-card__images">
          {product.images.length > 0 ? (
            product.images.map((image) => (
              <img
                key={image.id}
                src={image.filepath}
                alt={product.name}
              />
            ))
          ) : (
            <div className="detail-card__no-image">이미지가 없습니다.</div>
          )}
        </div>

        <div className="detail-card__body">
          <p className="detail-card__eyebrow">{product.category_name}</p>
          <h1 className="detail-card__title">{product.name}</h1>
          <p className="detail-card__price">{Number(product.price).toLocaleString()}원</p>
          <p className="detail-card__content">{product.content || '상품 설명이 없습니다.'}</p>
          <div className="detail-card__meta">
            판매자: {product.username} · 등록일: {product.created_dt}
          </div>

          <div className="detail-card__buttons">
            {canEdit && (
              <>
                <button onClick={() => navigate(`/productupsert?id=${id}`)}>수정</button>
                <button className="detail-card__delete" onClick={deleteProduct}>삭제</button>
              </>
            )}
            <button className="detail-card__back" onClick={() => navigate('/')}>목록으로</button>
          </div>
        </div>
      </article>
    </main>
  );
}

export default Detail;
