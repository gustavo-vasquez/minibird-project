using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;

namespace MiniBird.Filters
{
    public class SessionFilters
    {
        public class RememberSessionAttribute : FilterAttribute, IAuthorizationFilter
        {
            public void OnAuthorization(AuthorizationContext filterContext)
            {
                var loginCookie = filterContext.HttpContext.Request.Cookies["MBLC"];
                var session = filterContext.HttpContext.Session["MiniBirdAccount"];

                if (session != null)
                    Domain_Layer.ActiveSession.Fill(session);
                else
                    Domain_Layer.ActiveSession.Clear();

                if (loginCookie != null)
                {
                    filterContext.HttpContext.Session["MiniBirdAccount"] = new Service_Layer.AccountSL().CreateSessionFromCookieSL(loginCookie.Value);
                    Domain_Layer.ActiveSession.Fill(filterContext.HttpContext.Session["MiniBirdAccount"]);
                }
            }
        }        

        public class AuthenticatedAttribute : ActionFilterAttribute
        {
            private readonly bool _authenticationRequired;

            public AuthenticatedAttribute()
            {
                _authenticationRequired = true;
            }

            public AuthenticatedAttribute(bool authenticationRequired)
            {
                _authenticationRequired = authenticationRequired;
            }

            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                if (_authenticationRequired)
                {
                    if (filterContext.HttpContext.Session["MiniBirdAccount"] == null)
                        filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary()
                        {
                            { "controller", "Home" },
                            { "action", "Welcome" }
                        });
                }                    
            }
        }

        internal class HttpStatusCodeResult : ActionResult
        {
            private int _code { get; set; }
            private string _description { get; set; }

            /// <summary>
            /// Devuelve el codigo error suministrado como respuesta.
            /// </summary>
            /// <param name="code">Código de error</param>
            /// <param name="description">Descripción del error</param>
            /// <returns></returns>
            public HttpStatusCodeResult(int code, string description)
            {
                this._code = code;
                this._description = description;
            }

            public override void ExecuteResult(ControllerContext context)
            {
                context.HttpContext.Response.StatusCode = _code;
                context.HttpContext.Response.StatusDescription = _description;
            }
        }
    }
}