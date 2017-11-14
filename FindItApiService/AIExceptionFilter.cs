using System.Web.Http.Filters;
using Microsoft.ApplicationInsights;

namespace FindItApiService
{
    public class AIExceptionFilter : ExceptionFilterAttribute
    {
        private static TelemetryClient _telemetry = new TelemetryClient();

        public override void OnException(HttpActionExecutedContext context)
        {
            _telemetry.TrackException(context.Exception);
        }
    }
}