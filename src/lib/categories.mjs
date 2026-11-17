import { randomUUID } from 'node:crypto';
import { validCategoryIcon } from './category-icons.mjs';

export class CategoryInputError extends Error {}
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
const checkIcon = icon => { if (!validCategoryIcon(icon)) throw new CategoryInputError('Elige un icono del catálogo.'); };

export async function updateCategory(pool, userId, categoryId, input) {
  if (!uuid(categoryId)) throw new CategoryInputError('La categoría no es válida.');
  if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 80) throw new CategoryInputError('Escribe un nombre de hasta 80 caracteres.');
  if (input.kind !== 'income' && input.kind !== 'expense') throw new CategoryInputError('Elige ingreso o gasto.');
  checkIcon(input.icon);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[category]] = await connection.execute('SELECT id, kind FROM categories WHERE user_id = ? AND id = ? FOR UPDATE', [userId, categoryId]);
    if (!category) throw new CategoryInputError('Esta categoría ya no está disponible. Actualiza la página.');
    if (category.kind !== input.kind) {
      for (const table of ['movements', 'budgets', 'scheduled_payments']) {
        const [[linked]] = await connection.execute(`SELECT id FROM ${table} WHERE user_id = ? AND category_id = ? LIMIT 1`, [userId, categoryId]);
        if (linked) throw new CategoryInputError('Esta categoría está en uso. Puedes cambiar nombre e icono, pero conserva su tipo.');
      }
    }
    await connection.execute('UPDATE categories SET name = ?, kind = ?, icon = ? WHERE user_id = ? AND id = ?', [input.name.trim(), input.kind, input.icon, userId, categoryId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new CategoryInputError('Ya tienes una categoría con ese nombre y tipo.');
    throw error;
  } finally { connection.release(); }
}

export async function deleteCategory(pool, userId, categoryId) {
  if (!uuid(categoryId)) throw new CategoryInputError('La categoría no es válida.');
  try {
    // Existing FKs protect references atomically, including concurrent insertions.
    const [result] = await pool.execute('DELETE FROM categories WHERE user_id = ? AND id = ?', [userId, categoryId]);
    if (!result.affectedRows) throw new CategoryInputError('Esta categoría ya no está disponible. Actualiza la página.');
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') throw new CategoryInputError('Esta categoría tiene movimientos, presupuestos o pagos asociados. No se puede eliminar para conservar su historial.');
    throw error;
  }
}

export async function createCategory(pool, userId, input) {
  if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 80) throw new CategoryInputError('Escribe un nombre de hasta 80 caracteres.');
  if (input.kind !== 'expense' && input.kind !== 'income') throw new CategoryInputError('Elige ingreso o gasto.');
  const icon = input.icon ?? 'tag';
  checkIcon(icon);
  try {
    await pool.execute('INSERT INTO categories (id, user_id, name, kind, icon) VALUES (?, ?, ?, ?, ?)', [randomUUID(), userId, input.name.trim(), input.kind, icon]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new CategoryInputError('Ya tienes una categoría con ese nombre y tipo.');
    throw error;
  }
}

export async function saveCategoryIcon(pool, userId, categoryId, icon) {
  if (!uuid(categoryId)) throw new CategoryInputError('La categoría no es válida.');
  checkIcon(icon);
  // A single scoped write is atomic. matched/unchanged updates are successful too.
  const [result] = await pool.execute('UPDATE categories SET icon = ? WHERE user_id = ? AND id = ?', [icon, userId, categoryId]);
  if (!result.affectedRows) throw new CategoryInputError('Esta categoría no está disponible. Actualiza la página.');
}
