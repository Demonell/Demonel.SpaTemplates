namespace ReactRedux.Options
{
    public class SpaRuntimeConfig
    {
        public string AuthorityUrl { get; set; }
        public string MyServiceUrl { get; set; }

        public SpaRuntimeConfig(SpaOptions options)
        {
            AuthorityUrl = options.AuthorityUrl;
            MyServiceUrl = options.MyServiceUrl;
        }
    }
}
