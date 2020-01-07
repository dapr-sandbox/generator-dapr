// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// ------------------------------------------------------------

using System;
using Microsoft.AspNetCore.Mvc;
using DaprProject.Models;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text;

namespace DaprProject.Controllers
{
    [ApiController]
    public class StateController : ControllerBase
    {
        static readonly string stateURL = $"http://localhost:{System.Environment.GetEnvironmentVariable("DAPR_HTTP_PORT") ?? "3500"}/v1.0/state";
        static readonly HttpClient client = new HttpClient();

        //GET: /RandomNumber
        [Route("[action]")]
        [HttpGet]
        public int RandomNumber()
        {
            Random random = new Random();
            return random.Next(0, 100);
        }
        [Route("[action]")]
        [HttpPost]
        public async Task SaveNumber(Value value)
        {
            string json = ($"[{{\"key\":\"savedNumber\",\"value\":{value.Number}}}]");
            var httpResponse = await client.PostAsync(
              stateURL,
                new StringContent(json, Encoding.UTF8, "application/json"));

            if (httpResponse.Content != null)
            {
                var content = await httpResponse.Content.ReadAsStringAsync();
                Console.WriteLine("Content: " + content);
            }
            return;
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<string> SavedNumber()
        {
            var response = await client.GetAsync($"{stateURL}/savedNumber");
            return await response.Content.ReadAsStringAsync();
        }

        [HttpGet]
        [Route("dapr/subscribe")]
        public string Subscribe()
        {
            var json = "[\"A\", \"B\"]";
            return json;
        }

        [Route("[action]")]
        [HttpPost]
        public ActionResult A(Value value)
        {
            Console.WriteLine("Received message of topic A: " + value.Number);
            return new EmptyResult();
        }

        [Route("[action]")]
        [HttpPost]
        public ActionResult B(Value value)
        {
            Console.WriteLine("Received message of topic B: " + value.Number);
            return new EmptyResult();
        }
    }
}