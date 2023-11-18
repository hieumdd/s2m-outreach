URL := $(shell gcloud run services describe s2m-outreach-server --format='value(status.url)')

deploy-server:
	gcloud run deploy s2m-outreach-server \
		--image=us-docker.pkg.dev/nutshell-394011/docker-1/s2m-outreach:master \
		--args='server' \
		--set-secrets=OUTREACH_CLIENT_ID=outreach-client-id:latest,OUTREACH_CLIENT_SECRET=outreach-client-secret:latest \
		--set-env-vars=FIRESTORE_DB=master,PUBLIC_URL=$(URL)

create-job:
	gcloud run jobs create s2m-outreach-executor \
		--image=us-docker.pkg.dev/nutshell-394011/docker-1/s2m-outreach:master \
		--args='execute' \
		--cpu=4 \
		--memory=4Gi \
		--set-secrets=OUTREACH_CLIENT_ID=outreach-client-id:latest,OUTREACH_CLIENT_SECRET=outreach-client-secret:latest \
		--set-env-vars=FIRESTORE_DB=master,PUBLIC_URL=$(URL)


