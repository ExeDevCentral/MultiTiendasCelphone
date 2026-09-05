/**
 * Mappers camelCase (dominio frontend) <-> snake_case (schema Supabase).
 * Mantiene el shape exacto que el frontend ya consume.
 */

export function toStoreRow(store) {
  const row = {
    id: store.id,
    slug: store.slug,
    name: store.name,
    tagline: store.tagLine ?? store.tagline,
    description: store.description,
    logo: store.logo,
    banner: store.banner,
    theme_color: store.themeColor,
    theme_gradient: store.themeGradient,
    address: store.address,
    phone_whatsapp: store.phoneWhatsApp,
    email: store.email,
    rating: store.rating,
    review_count: store.reviews ?? store.reviewCount,
    verified: store.verified,
    specialty: store.specialty,
  };
  if (store.managerEmail || store.managerPassword) {
    row.manager_email = store.managerEmail;
    row.manager_password_hash = store.managerPassword;
  }
  return row;
}

export function toStoreJS(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagLine: row.tagline ?? '',
    description: row.description ?? '',
    logo: row.logo ?? '',
    banner: row.banner ?? '',
    themeColor: row.theme_color ?? '#0071e3',
    themeGradient: row.theme_gradient ?? 'from-blue-600 via-indigo-600 to-sky-400',
    address: row.address ?? '',
    phoneWhatsApp: row.phone_whatsapp ?? '',
    email: row.email ?? '',
    rating: Number(row.rating ?? 5),
    reviews: Number(row.review_count ?? 0),
    verified: row.verified ?? true,
    specialty: row.specialty ?? '',
    managerEmail: row.manager_email ?? '',
  };
}

export function toProductRow(product) {
  return {
    id: product.id,
    store_id: product.storeId,
    name: product.name,
    brand: product.brand,
    type: product.type ?? 'phone',
    category: product.category ?? null,
    model_year: product.modelYear,
    generation_category: product.generationCategory ?? 'last_2_years',
    price: product.price,
    original_price: product.originalPrice ?? null,
    stock: product.stock ?? 0,
    status: product.status ?? 'published',
    condition_desc: product.condition ?? null,
    tagline: product.tagline ?? null,
    description: product.description ?? null,
    compatibility: product.compatibility ?? null,
    model_3d_type: product.model3dType ?? 'modern_flagship',
    images: product.images ?? [],
    colors: product.colors ?? [],
    storage_options: product.storageOptions ?? [],
    specs: product.specs ?? {},
    solutions: product.solutions ?? [],
    tags: product.tags ?? [],
    is_featured: product.isFeatured ?? false,
    rating: product.rating ?? 5,
    review_count: product.reviewCount ?? 0,
    photo_url: product.photo_url ?? null,
    depth_map_url: product.depth_map_url ?? null,
    depth_status: product.depth_status ?? 'none',
  };
}

export function toProductJS(row) {
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    brand: row.brand,
    type: row.type,
    category: row.category ?? null,
    modelYear: row.model_year,
    generationCategory: row.generation_category,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    stock: row.stock,
    status: row.status,
    condition: row.condition_desc ?? '',
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    compatibility: row.compatibility ?? '',
    model3dType: row.model_3d_type ?? 'modern_flagship',
    images: row.images ?? [],
    colors: row.colors ?? [],
    storageOptions: row.storage_options ?? [],
    specs: row.specs ?? {},
    solutions: row.solutions ?? [],
    tags: row.tags ?? [],
    isFeatured: row.is_featured ?? false,
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 0),
    photo_url: row.photo_url ?? null,
    depth_map_url: row.depth_map_url ?? null,
    depth_status: row.depth_status ?? 'none',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toOrderRow(order) {
  const customer = order.customer ?? {};
  return {
    id: order.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    store_id: order.storeId,
    customer: customer,
    items: order.items ?? [],
    total: order.total ?? 0,
    status: order.status ?? 'Confirmado',
    payment_method: order.paymentMethod ?? 'mercadopago',
    mercadopago_preference_id: order.mercadopagoPreferenceId ?? null,
    payment_status: order.paymentStatus ?? 'pending',
  };
}

export function toOrderJS(row) {
  return {
    id: row.id,
    storeId: row.store_id,
    customer: row.customer ?? {},
    items: row.items ?? [],
    total: Number(row.total ?? 0),
    status: row.status ?? 'Confirmado',
    paymentMethod: row.payment_method ?? 'mercadopago',
    mercadopagoPreferenceId: row.mercadopago_preference_id ?? null,
    paymentStatus: row.payment_status ?? 'pending',
    createdAt: row.created_at,
    date: row.created_at ?? new Date().toISOString(),
  };
}