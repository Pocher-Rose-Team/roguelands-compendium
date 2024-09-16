import { HttpRequestConfig, RxJSHttpClient } from "rxjs-http-client";
import { mergeMap, Observable } from "rxjs";

export class HttpClient {
  private http;

  constructor() {
    this.http = new RxJSHttpClient();
  }

  public get<T>(url: string, config?: Partial<HttpRequestConfig> | undefined): Observable<T> {
    return this.http.get(url, config).pipe(mergeMap((response) => response.json()));
  }

  public post<T>(url: string, body: any): Observable<T> {
    return this.http.post(url, { body: body }).pipe(mergeMap((response) => response.json()));
  }

  public put<T>(url: string, body: any): Observable<T> {
    return this.http.put(url, { body: body }).pipe(mergeMap((response) => response.json()));
  }

  public patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch(url, { body: body }).pipe(mergeMap((response) => response.json()));
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete(url, {}).pipe(mergeMap((response) => response.json()));
  }
}
