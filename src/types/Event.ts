export interface Event {
	name: string;
	invoke(...args: any[]): Promise<unknown>;
}