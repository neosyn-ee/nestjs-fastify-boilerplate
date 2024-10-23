export interface BaseInterfaceRepository<T, CreateInput = T> {
  create(data: CreateInput): Promise<T>; // Specifica CreateInput per la creazione

  findOneById(id: number): Promise<T | null>; // Ritorna null se non trovato

  findByCondition(filterCondition: Partial<T>): Promise<T | null>; // Utilizza Partial per la ricerca

  findAll(): Promise<T[]>; // Ritorna un array di T

  remove(id: number): Promise<T | null>; // Ritorna null se non trovato

  findWithRelations(relations: any): Promise<T[]>; // Potresti voler tipizzare 'relations'

  update(id: number, data: Partial<T>): Promise<T | null>; // Aggiungi un metodo di aggiornamento
}
