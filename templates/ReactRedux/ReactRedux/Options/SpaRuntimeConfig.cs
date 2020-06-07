namespace ReactRedux.Options
{
    public class SpaRuntimeConfig
    {
        public string AuthorityUrl { get; set; }
        public string ProductsUrl { get; set; }

        public SpaRuntimeConfig(SpaOptions options)
        {
            AuthorityUrl = options.AuthorityUrl;
            ProductsUrl = options.ProductsUrl;
        }
    }
}
