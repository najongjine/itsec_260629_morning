import { useEffect, useState } from 'react';
import './ProductList.css';
import { useNavigate, useSearchParams } from 'react-router';

interface ProductType {
  product_id: number;
  name: string;
  price: number;
  category_id: number;
  created_dt: string;
  user_id: number;
  username: string;
  category_name: string;
  img: string | null;
}

function ProductList() {
  const navigate=useNavigate();
  const [productList, setProductList] = useState<ProductType[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      let response: any = await fetch('http://localhost:8000/productlist', {
        method: 'GET',
      });
      response = await response.json();

      if (!response.success) {
        alert(`상품 목록 조회 실패: ${response.msg || ''}`);
        return;
      }

      setProductList(response?.data || []);
    } catch (error: any) {
      alert(`오류: ${error.message || ''}`);
    }
  }

  return (
    <main className="product-page">
      <header className="product-page__header">
        <div>
          <p className="product-page__eyebrow">SHOP</p>
          <h1 className="product-page__title">상품 목록</h1>
          <p className="product-page__description">
            지금 준비된 상품을 한눈에 둘러보세요.
          </p>
        </div>

        <span className="product-page__count">
          총 <strong>{productList.length}</strong>개
        </span>
      </header>

      {productList.length <= 0 && (
        <div className="product-state">
          <span className="product-state__icon" aria-hidden="true">·</span>
          <p>등록된 상품이 없습니다.</p>
          <small>새로운 상품이 등록되면 이곳에 표시됩니다.</small>
        </div>
      )}

      {productList.length > 0 && (
        <section className="product-grid" aria-label="상품 목록">
          {productList.map((product) => (
            <article
              className="product-card"
              key={product.product_id}
              onClick={() => navigate(`/detail?id=${product.product_id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  navigate(`/detail?id=${product.product_id}`);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="product-card__image-wrap">
                <div className="product-card__placeholder" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Zm1.5 0v9.77l3.02-3.02a1.5 1.5 0 0 1 2.12 0l1.36 1.36 2.86-2.86a1.5 1.5 0 0 1 2.12 0l1.52 1.52V5.5h-13Zm13 8.89-2.58-2.58L13.06 14.67l3.83 3.83h1.61v-4.11Zm-3.73 4.11-5.19-5.19-4.08 4.08v1.11h9.27ZM8.25 7a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                  </svg>
                </div>

                {product.img && (
                  <img
                    className="product-card__image"
                    src={`http://localhost:8000${product.img}`}
                    alt={product.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                <span className="product-card__category">
                  {product.category_name || '기타'}
                </span>
              </div>

              <div className="product-card__content">
                <h2 className="product-card__name">{product.name}</h2>
                <p className="product-card__price">
                  {Number(product.price).toLocaleString()}원
                </p>
                <div className="product-card__meta">
                  <span>판매자</span>
                  <strong>{product.username || '알 수 없음'}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
      <div>
        <button onClick={(e)=>{
          navigate("/productupsert");
        }}>상품등록</button>
      </div>
    </main>
  );
}

export default ProductList;
