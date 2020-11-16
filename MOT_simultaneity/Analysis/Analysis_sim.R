library(rjson)
library(tidyverse)

setwd('/Users/young/Desktop/UCSD/Research/MOT_2020/MOT_simultaneity/Data_replicate/Raw_data')
#data transformation
all.data.sim = list()
subject = 1
for(file.name in list.files(pattern = '*.json')) {
  json_file = fromJSON(file = file.name)
  json_file[['subject']] = subject
  all.data.sim[[subject]] = json_file
  subject = subject + 1
}

num.subj = length(all.data.sim)

#extract the target selected for 3 conditions from all the participants
dat.accuracy.sim = data.frame()
for(i in 1:num.subj) {
  for(j in 1:42) {
    dat.accuracy.sim = rbind(dat.accuracy.sim,
                         data.frame(subject = all.data.sim[[i]]$subject,
                                    trial_number = all.data.sim[[i]]$trials[[j]]$trialNumber,
                                    trial_type = all.data.sim[[i]]$trials[[j]]$trialType,
                                    trial_sim = all.data.sim[[i]]$trials[[j]]$sim,
                                    crit_type = all.data.sim[[i]]$trials[[j]]$crit_type,
                                    target_1 = all.data.sim[[i]]$trials[[j]]$selected_targets[1],
                                    target_2 = all.data.sim[[i]]$trials[[j]]$selected_targets[3],
                                    target_3 = all.data.sim[[i]]$trials[[j]]$selected_targets[5],
                                    target_4 = all.data.sim[[i]]$trials[[j]]$selected_targets[7]))
  }
}

#compute the accuracy rate for each trial (out of 4 pairs)
dat.accuracy.sim = dat.accuracy.sim %>% rowwise() %>% mutate(accuracy = (target_1 + target_2 + target_3 + target_4)/4) %>% ungroup()

setwd('/Users/young/Desktop/UCSD/Research/MOT_2020/MOT_simultaneity/Data_replicate')
save(dat.accuracy.sim,file = "sim_replicate_data.Rdata")

load("sim_replicate_data.Rdata")

#Specify trial conditions
dat.accuracy.sim$trial_type[dat.accuracy.sim$trial_type%in%c(0)] = 0
dat.accuracy.sim$trial_type[dat.accuracy.sim$trial_type%in%c(1,3,5)] = 1
dat.accuracy.sim$trial_type[dat.accuracy.sim$trial_type%in%c(2,4,6)] = 2
  
summary_accuracy.sim = dat.accuracy.sim %>% group_by(subject,trial_type,trial_sim) %>% 
  summarise(mean = mean(accuracy)) %>% ungroup()

summary_accuracy.sim %>% ggplot(aes(x=subject, y=mean, color = as.factor(trial_type),shape = as.factor(trial_sim))) +
  geom_point() + 
  facet_grid(trial_type~.)+  
  geom_hline(yintercept = c(0.5,0.5,0.5),color="orange",linetype = "dashed",size=1)+
  theme_bw()+
  ylim(0,1)+
  theme(panel.grid = element_blank())+
  labs(color = "Trial type", y = "accuracy")

trial_names = c("p","v1","v2","v4","a1","a2","a4")
summary_accuracy.sim$trial_name = as.factor(rep(trial_names,124))
summary_accuracy.sim$trial_type = as.factor(summary_accuracy.sim$trial_type)
summary_accuracy.sim$trial_sim = as.factor(summary_accuracy.sim$trial_sim)
summary_accuracy.sim$subject = as.factor(summary_accuracy.sim$subject)


#Group and order the trial types
trial_names = c("a","av, sim = 4","av, sim = 2","av, sim = 1","va, sim = 4","va, sim = 2","va, sim = 1")

overall_summary_accuracy.sim = summary_accuracy.sim %>% group_by(trial_type,trial_sim) %>% summarise(N=n(),mean_overall = mean(mean),
                                                                                                     sd_overall = sd(mean))
overall_summary_accuracy.sim$trial_names = trial_names

overall_summary_accuracy.sim$trial_type = factor(overall_summary_accuracy.sim$trial_type, labels = c("Position", "Velocity", "Acceleration"))

overall_summary_accuracy.sim %>% ggplot(aes(x=as.factor(trial_names), y=mean_overall,fill=as.factor(trial_type)))+
  geom_bar(stat = "identity")+
  geom_errorbar(aes(ymin=mean_overall - sd_overall/sqrt(N),
                    ymax=mean_overall + sd_overall/sqrt(N)),
                width = 0.1)+
  labs(x="Simultaneity", y = "Accurarcy")+
  scale_y_continuous(breaks = seq(0, 1, by=0.1), limits=c(0,1))+
  theme_bw() +
  theme(panel.grid = element_blank(),
        axis.ticks.x = element_blank(),
        legend.position = "none",
        axis.text.x = element_blank(),
        axis.title.x = element_blank(),
        axis.text.y = element_text(size = 16, face = "bold"),
        axis.title.y = element_text(size = 16, face = "bold"))+
  geom_hline(yintercept = 0.5,color="darkblue",linetype = "dashed",size=1)

position.sim = summary_accuracy.sim %>% filter(trial_type == 0)
velocity.sim = summary_accuracy.sim %>% filter(trial_type == 1)
acceleration.sim = summary_accuracy.sim %>% filter(trial_type == 2)
  
velocity.sim_4 = velocity.sim %>% filter(trial_sim == 4)
velocity.sim_4$mean %>% t.test(mu=0.5)

velocity.sim_2 = velocity.sim %>% filter(trial_sim == 2) 
velocity.sim_2$mean %>% t.test(mu=0.5)

velocity.sim_1 = velocity.sim %>% filter(trial_sim == 1)
velocity.sim_1$mean %>% t.test(mu=0.5)

v_sim_aov = aov(mean~factor(trial_sim)+Error(factor(subject)/factor(trial_sim)),data = velocity.sim)
summary(v_sim_aov)
t.test(velocity.sim_1$mean,velocity.sim_4$mean,paired = T, var.equal = F)
t.test(velocity.sim_2$mean, velocity.sim_4$mean, paired=T, var.equal = F)
t.test(velocity.sim_2$mean, velocity.sim_1$mean, paired=T, var.equal = F)
p.adjust(p = c(0.0002678,0.008522,0.1004), method = "bonferroni", n = 3)

acceleration.sim_4 = acceleration.sim %>% filter(trial_sim == 4)
acceleration.sim_4$mean %>% t.test(mu=0.5)

acceleration.sim_2 = acceleration.sim %>% filter(trial_sim == 2)
acceleration.sim_2$mean %>% t.test(mu=0.5)

acceleration.sim_1 = acceleration.sim %>% filter(trial_sim == 1)
acceleration.sim_1$mean %>% t.test(mu=0.5)

a_sim_aov = aov(mean~factor(trial_sim)+Error(factor(subject)/factor(trial_sim)),data = acceleration.sim)
summary(a_sim_aov)
t.test(acceleration.sim_1$mean,acceleration.sim_4$mean,paired = T, var.equal = F)
t.test(acceleration.sim_2$mean, acceleration.sim_4$mean, paired=T, var.equal = F)
t.test(acceleration.sim_2$mean, acceleration.sim_1$mean, paired=T, var.equal = F)
p.adjust(p = c(0.000191,0.3455,0.003536), method = "bonferroni", n = 3)
