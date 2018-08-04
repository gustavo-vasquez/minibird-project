﻿using System;
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
                else if (loginCookie != null)
                {
                    session = new Service_Layer.AccountSL().CreateSessionFromCookieSL(loginCookie.Value);
                    Domain_Layer.ActiveSession.Fill(session);
                }                    
                else
                    Domain_Layer.ActiveSession.Clear();
            }
        }        

        public class AuthenticatedAttribute : ActionFilterAttribute
        {
            private readonly bool _authenticated;

            public AuthenticatedAttribute()
            {
                _authenticated = true;
            }

            public AuthenticatedAttribute(bool authenticated)
            {
                _authenticated = authenticated;
            }

            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                if (_authenticated)
                {
                    if (filterContext.HttpContext.Session["MiniBirdAccount"] == null)                        
                        filterContext.Result = new HttpStatusCodeResult(403, "Acceso no autorizado - Solo usuarios registrados pueden ver el contenido");
                }                    
            }
        }        

        //public class GuestAttribute : FilterAttribute
        //{

        //}

        //public class AuthorizedOnlyAttribute : ActionFilterAttribute
        //{
        //    public override void OnActionExecuting(ActionExecutingContext filterContext)
        //    {
        //        object[] attributes = filterContext.ActionDescriptor.GetCustomAttributes(true);

        //        if (!attributes.Any(a => a is GuestAttribute))
        //            if (filterContext.HttpContext.Session["MiniBirdAccount"] == null)
        //                filterContext.Result = new HttpStatusCodeResult(403, "Acceso no autorizado - Solo usuarios registrados pueden ver el contenido");                
        //    }
        //}

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